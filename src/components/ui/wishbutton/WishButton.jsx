// src/components/ui/wishbutton/WishButton.jsx
import { useEffect, useMemo, useState } from 'react';
import useWishStore from '../../../store/wishStore';
import './style.scss';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // 빈 하트(FaRegHeart)도 추가

const WishButton = ({
    type = 'hotel',
    id,
    data = null,
    className = '',
    filledIcon: FilledIcon = FaHeart, // 기본 채워진 하트
    emptyIcon: EmptyIcon = FaRegHeart, // 기본 빈 하트
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
        } else {
            // 추가
            const payload = { uid, type, id, data };
            if (typeof addItemFn === 'function') {
                addItemFn(payload);
            } else {
                setStateItems([payload, ...before]);
            }
            setWished(true);
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
