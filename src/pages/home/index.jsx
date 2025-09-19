import Content1 from '../../components/home/content1/Content1';
import Content2 from '../../components/home/content2/Content2';
import Content3 from '../../components/home/content3/Content3';
import Content4 from '../../components/home/content4/Content4';
import Content5 from '../../components/home/content5/Content5';
import Content6 from '../../components/home/content6/Content6';
import HomeVisual from '../../components/home/visual/HomeVisual';
import './style.scss';

function Home() {
    return (
        <main className="home">
            <HomeVisual />
            <Content1 />
            <Content2 />
            <Content3 />
            <Content4 />
            <Content5 />
            <Content6 />
        </main>
    );
}

export default Home;
