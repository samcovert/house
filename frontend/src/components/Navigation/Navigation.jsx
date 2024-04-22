import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav>
      <div className='left-nav'>
        <NavLink to="/"><img className='logo' src='https://samsclub13.s3.us-west-2.amazonaws.com/logo.png'></img><span className='house-text'>House</span></NavLink>


      </div>
      <div className='right-nav'>
      <div hidden={!sessionUser} className='create-spot'>
        <NavLink to='/spots/new'>
          <button>Create New Spot</button>
        </NavLink>
      </div>
      {isLoaded && (
        <ProfileButton user={sessionUser} />
      )}
      </div>
    </nav>
  );
}

export default Navigation;
