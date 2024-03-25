import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav>
      <div>
        <NavLink to="/"><img className='logo' src='https://samsclub13.s3.us-west-2.amazonaws.com/logo.png'></img></NavLink>
      </div>
      <div hidden={!sessionUser} className='create-spot'>
        <NavLink to='/spots/new'>
          <button>Create New Spot</button>
        </NavLink>
      </div>
      {isLoaded && (
        <ProfileButton user={sessionUser} />
      )}
    </nav>
  );
}

export default Navigation;
