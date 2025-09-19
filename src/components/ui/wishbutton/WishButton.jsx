// src/components/ui/wishbutton/WishButton.jsx
import { useEffect, useMemo, useState } from 'react';
import useWishStore from '../../../store/wishStore';
import './style.scss';

const WishButton = ({ type = 'hotel', id, data = null, className = '' }) => {
    // 구독용(리렌더를 위해)
    const items = useWishStore((s) => s.items) || [];

    // 가능한 여러 시그니처를 시도할 remove/add 함수들
    const addItemFn = useWishStore((s) => s.addItem || s.add || s.pushItem || s.addWish || null);
    const removeItemFn = useWishStore(
        (s) => s.removeItem || s.remove || s.deleteItem || s.removeByUid || null
    );
    const setItemsFn = useWishStore((s) => s.setItems || null);

    // 헬퍼: 직접 스토어 상태 읽기/쓰기 (zustand hook 함수 자체에서 제공)
    const getStateItems = () => useWishStore.getState().items || [];
    const setStateItems = (newItems) => useWishStore.setState({ items: newItems });

    const uid = (data && data.uid) || `${type}-${id}`;

    const isWishedFromStore = useMemo(
        () =>
            items.some(
                (it) =>
                    (it?.uid && it.uid === uid) ||
                    ((String(it?.id) === String(id) || String(it?.id) === String(uid)) &&
                        it?.type === type)
            ),
        [items, uid, id, type]
    );

    const [wished, setWished] = useState(isWishedFromStore);
    useEffect(() => setWished(isWishedFromStore), [isWishedFromStore]);

    // 후보 호출 유틸 (성공/실패 레이블 반환)
    const tryCall = async (candidates = []) => {
        for (let i = 0; i < candidates.length; i++) {
            const { fn, args, label } = candidates[i];
            if (typeof fn !== 'function') continue;
            try {
                // eslint-disable-next-line no-console
                console.log('[WishButton] 시도:', label, 'args:', args);
                const res = fn(...args);
                if (res && typeof res.then === 'function') await res;
                // eslint-disable-next-line no-console
                console.log('[WishButton] 성공:', label);
                return { ok: true, label };
            } catch (err) {
                // eslint-disable-next-line no-console
                console.warn('[WishButton] 실패:', label, err);
            }
        }
        return { ok: false };
    };

    const handleToggle = async (e) => {
        e?.stopPropagation?.();

        const before = getStateItems();
        // eslint-disable-next-line no-console
        console.log('[WishButton] BEFORE store.items length:', before.length);

        if (wished) {
            // 삭제 시도
            const removed = await tryCall([
                { fn: removeItemFn, args: [uid], label: 'remove(uid)' },
                {
                    fn: removeItemFn,
                    args: [{ id, type, uid, data }],
                    label: 'remove({id,type,uid})',
                },
                { fn: removeItemFn, args: [id], label: 'remove(id)' },
                { fn: removeItemFn, args: [{ id, type }], label: 'remove({id,type})' },
            ]);

            const after = getStateItems();
            // 스토어가 변하지 않았으면(failed to mutate), 직접 적용(optimistic)
            if (!removed.ok || JSON.stringify(before) === JSON.stringify(after)) {
                // 직접 필터링해서 제거
                const newItems = before.filter(
                    (it) =>
                        !(
                            (it?.uid || `${it?.type}-${it?.id}`) === uid ||
                            (String(it?.id) === String(id) && it?.type === type)
                        )
                );
                setStateItems(newItems);
                setWished(false);
                // eslint-disable-next-line no-console
                console.log(
                    '[WishButton] 폴백: store.items 직접 업데이트(삭제). new length:',
                    newItems.length
                );
            } else {
                setWished(false);
            }
        } else {
            // 추가 시도
            const payload = { uid, type, id, data };
            const added = await tryCall([
                { fn: addItemFn, args: [payload], label: 'addItem({uid,type,id,data})' },
                { fn: addItemFn, args: [{ id, type, data }], label: 'addItem({id,type,data})' },
                { fn: addItemFn, args: [id], label: 'addItem(id)' },
                { fn: addItemFn, args: [uid], label: 'addItem(uid)' },
            ]);

            const after = getStateItems();
            if (!added.ok || JSON.stringify(before) === JSON.stringify(after)) {
                // 중복 방지 후 전방 삽입
                const exists = before.some((it) => (it?.uid || `${it?.type}-${it?.id}`) === uid);
                if (!exists) {
                    const newItems = [{ uid, type, id, data }, ...before];
                    setStateItems(newItems);
                    setWished(true);
                    // eslint-disable-next-line no-console
                    console.log(
                        '[WishButton] 폴백: store.items 직접 업데이트(추가). new length:',
                        newItems.length
                    );
                } else {
                    // 이미 있었으면 그냥 wished true로
                    setWished(true);
                }
            } else {
                setWished(true);
            }
        }

        // eslint-disable-next-line no-console
        console.log('[WishButton] AFTER store.items length:', getStateItems().length);
    };

    return (
        <button
            type="button"
            className={`wish-button ${wished ? 'is-wished' : ''} ${className}`}
            aria-pressed={wished}
            onClick={handleToggle}
            title={wished ? '찜 해제' : '찜하기'}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleToggle(e);
                }
            }}
        >
            {wished ? '♥' : '♡'}
        </button>
    );
};

export default WishButton;
