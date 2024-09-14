import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        navigate('/book');
    }

    return (
        <>
            <div className='home-container'>
                <div className='content-container'>
                    <div className='home-heading'>
                        <h2>LIBRARY</h2>
                        <h2>MANAGEMENT SYSTEM</h2>
                    </div>
                    <div> </div>
                    <br />
                    <div className='home-page-button'>
                        <button onClick={handleClick}>Welcome Padawan!</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomePage;
