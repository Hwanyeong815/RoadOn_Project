import './style.scss';

const TabButton = ({ label, onClick, isActive }) => {
    return (
        <button className={`tab-button ${isActive ? 'g' : ''}`} onClick={onClick}>
            {label || '빈칸'}
        </button>
    );
};

export default TabButton;
