import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav>
      <div>
        <NavLink to="/"><img className='logo' src='../../images/logo.png'></img></NavLink>
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
