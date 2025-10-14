import { useState } from 'react';
import './style.scss';
import Component from './component/Component1';

const themeData = [
    {
        tag: '#드라마',
        img: './images/main/drama1.png',
        desc: '감성적인 드라마 여행',
        img2: ['./images/main/circle1.png'],
    },
    {
        tag: '#영화',
        img: './images/main/movie1.png',
        img2: ['./images/main/circle8.png'],
        desc: '영화 속 명장면을 직접 체험',
    },
    {
        tag: '#예능',
        img: './images/main/entertain1.png',
        img2: ['./images/main/circle4.png'],
        desc: '예능 촬영지 투어',
    },
    {
        tag: '#K-POP',
        img: './images/main/blackpink1.png',
        img2: ['./images/main/circle11.png'],
        desc: 'K-POP 성지순례',
    },
];

const Content1 = () => {
    const [activeIdx, setActiveIdx] = useState(0);

    return (
        <section className="themeSection">
            <div className="inner">
                <div className="title-wrap">
                    <img src="./images/main/content1title.png" alt="title" className="title-img" />
                    <span className="highlight"></span>
                </div>
                <ul className="tags">
                    {themeData.map((item, idx) => (
                        <li
                            key={item.tag}
                            className={activeIdx === idx ? 'active' : ''}
                            onClick={() => setActiveIdx(idx)}
                        >
                            {item.tag}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 선택된 태그의 데이터를 props로 전달 */}
            <div className="themeContent">
                <Component
                    tag={themeData[activeIdx].tag}
                    img={themeData[activeIdx].img}
                    img2={themeData[activeIdx].img2}
                    desc={themeData[activeIdx].desc}
                />
            </div>
        </section>
    );
};

export default Content1;
