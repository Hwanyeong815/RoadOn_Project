import { useEffect, useMemo, useState } from 'react';
import useWishStore from '../../../store/wishStore';
import './style.scss';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const WishButton = ({
    type = 'hotel',
    id,
    data = null,
    className = '',
    filledIcon: FilledIcon = FaHeart,
    emptyIcon: EmptyIcon = FaRegHeart,
    onWish, // ✅ 추가: 토글 결과 전달 콜백 (true=추가, false=삭제)
}) => {
    const items = useWishStore((s) => s.items) || [];
    const addItemFn = useWishStore((s) => s.addItem || null);
    const removeItemFn = useWishStore((s) => s.removeItem || null);

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

    const handleToggle = (e) => {
        e?.stopPropagation?.();
        const before = getStateItems();

        if (wished) {
            // 삭제
            if (typeof removeItemFn === 'function') {
                removeItemFn(uid);
            } else {
                const newItems = before.filter((it) => it.uid !== uid);
                setStateItems(newItems);
            }
            setWished(false);
            onWish?.(false); // ✅ 삭제 콜백
        } else {
            // 추가
            const payload = { uid, type, id, data };
            if (typeof addItemFn === 'function') {
                addItemFn(payload);
            } else {
                setStateItems([payload, ...before]);
            }
            setWished(true);
            onWish?.(true); // ✅ 추가 콜백
        }
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
            {wished ? <FilledIcon className="fill" /> : <EmptyIcon className="not" />}
        </button>
    );
};

export default WishButton;
