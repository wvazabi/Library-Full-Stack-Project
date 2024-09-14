import { useNavigate } from 'react-router-dom';
import './HomePage.css'


function HomePage() {

    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        navigate('/book')
    }


  return (
    <>
    
    <div className='home-container'>
      <div className='home-heading'>
        <h2>KÜTÜPHANE YÖNETİM SİSTEMİ</h2>
      </div>
      <div className='home-page-button'>
        <button onClick={handleClick}>Hoşgeldiniz</button>
      </div>
    </div>
        
      
    </>
  )
}

export default HomePage