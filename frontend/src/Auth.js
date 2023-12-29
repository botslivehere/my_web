import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';
import React, { useState,useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import Url from './url.js'

import './Auth.css';

function Auth() {

    let SessionTime = 600000;

    const isAuthenticated = useSelector((state) => state.isAuthenticated);
    const dispatch = useDispatch();
  
    const login = () => {
      dispatch({ type: 'LOGIN' });
    };
  
    const logout = () => {
      dispatch({ type: 'LOGOUT' });
    };

    const [isSessionExpired, setSessionExpired] = useState(false);

      const checkSessionExpiration = () => {
        const sessionData = Cookies.get('sessionData');
        if (sessionData) {
            const { expires } = JSON.parse(sessionData);
            const expirationTime = new Date(expires).getTime();
            const currentTime = new Date().getTime();
          const timeout = Math.max(0, expirationTime - currentTime);
          console.log("Expiration Time:",timeout);
          setTimeout(() => {
           handleOut();
          }, timeout);
        }
      };

      useEffect(() => {
        checkSessionExpiration();
      }, []);

    const [User, setUser] = useState({ id: null });

    let sessionData = Cookies.get('sessionData');

    useEffect(() => {
        if (sessionData) {
            if (typeof sessionData === 'string') sessionData = JSON.parse(sessionData);
            console.log("current session:", sessionData.session);
            setUser((prevUser) => ({ ...prevUser, id: sessionData.id }));
            console.log("current id:", User.id);
            console.log("session json:",sessionData);
          login();
        }
      }, [sessionData]);

    const [formData, setFormData] = useState({
        login: '',
        password: '',
      });

      const handleFormSubmit = (event) => {
        event.preventDefault();
    
        const apiUrl = Url+':3001/auth'; 
    
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          credentials: 'include',
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Backend response:', data);
            if(data.session){
                const expirationTime = new Date(Date.now() + SessionTime);
                data.expires = expirationTime;
                Cookies.set('sessionData', JSON.stringify(data), { expires:expirationTime});
                console.log('Информация о сессии:',  data.session);
                login();
                checkSessionExpiration();
            }
          })
          .catch((error) => {
            console.error('Error sending data to backend:', error);
          });
      };

      const handleFormSubmit2 = (event) => {
        event.preventDefault();
    
        const apiUrl = Url+':3001/register'; 
    
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          credentials: 'include',
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Backend response:', data);
            if(data.session){
                const expirationTime = new Date(Date.now() + SessionTime);
                data.expires = expirationTime;
                Cookies.set('sessionData', JSON.stringify(data), { expires:expirationTime});
                console.log('Информация о сессии:',  data.session);
                login();
                checkSessionExpiration();
            }
          })
          .catch((error) => {
            console.error('Error sending data to backend:', error);
          });
      };


      const handleLogout = (event) => {
          if (event) {
        event.preventDefault();
        }
    
        const apiUrl = Url+':3001/logout'; 
    
        fetch(apiUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Backend response:', data);
            logout();
            Cookies.remove('sessionData');
            setSessionExpired(true);
          })
          .catch((error) => {
            console.error('Error sending data to backend:', error);
          });
      };

    const [selectedForm, setSelectedForm] = useState(null);

    const handleFormSelection = () => {
        let formName = selectedForm === 'reg' ? 'log' : 'reg';
        setSelectedForm(formName);
    };

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData((prevData) => ({
          ...prevData,
          [id]: value,
        }));
      };

      const handleOut = () => {
        handleLogout();
      };

      return (
        <div className="form-container">
            {!isAuthenticated && <Button className="m-3" onClick={() => handleFormSelection()}>Авторизация/Регистрация</Button>}
    
            {!isAuthenticated && selectedForm === 'reg' && <Form onSubmit={handleFormSubmit2}>
                <Form.Label>Регистрация</Form.Label>
                <Form.Group className="mb-3">
                    <Form.Label>Login</Form.Label>
                    <Form.Control
                        type="text"
                        id="login"
                        placeholder=""
                        onChange={handleInputChange}
                        value={formData.login}
                        pattern="^[a-zA-Z0-9]+$"
                        minLength="8"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        id="password"
                        aria-describedby="passwordHelpBlock"
                        onChange={handleInputChange}
                        value={formData.password}
                        pattern="^[a-zA-Z0-9]+$"
                        minLength="8"
                        required
                    />
                    <Form.Text id="passwordHelpBlock" muted>
                        Ваш пароль должен содержать не менее 8 символов и не содержать спец. символы, знаки, эмодзи,
                        а также любые другие не содержащиеся в английском/символьном алфавите.
                    </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Зарегистрироваться
                </Button>
            </Form>}
    
            {!isAuthenticated && selectedForm === 'log' && <Form onSubmit={handleFormSubmit}>
                <Form.Label>Авторизация</Form.Label>
                <Form.Group className="mb-3">
                    <Form.Label>Login</Form.Label>
                    <Form.Control
                        type="text"
                        id="login"
                        placeholder=""
                        onChange={handleInputChange}
                        value={formData.login}
                        pattern="^[a-zA-Z0-9]+$"
                        minLength="8"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        id="password"
                        aria-describedby="passwordHelpBlock"
                        onChange={handleInputChange}
                        value={formData.password}
                        pattern="^[a-zA-Z0-9]+$"
                        minLength="8"
                        required
                    />
                    <Form.Text id="passwordHelpBlock" muted>
                        Ваш пароль должен содержать не менее 8 символов и не содержать спец. символы, знаки, эмодзи,
                        а также любые другие не содержащиеся в английском/символьном алфавите.
                    </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Войти
                </Button>
            </Form>}
            {isAuthenticated && (
                <div className="logged-in-info">
                    <div className="welcome">Welcome {User.id}</div>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                    {console.log("Now you can get access to Home page!")}
                </div>
            )}
            {!isAuthenticated && isSessionExpired && (
                <div>
                    <div className="session-expired">Your session has expired! Please log in again.</div>
                </div>
            )}
        </div>
    );    
  };
 
export default Auth;