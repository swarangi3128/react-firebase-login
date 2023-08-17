import React from 'react'
import loaderImg from '../../assets/audio.svg'
import styles from './Loader.module.scss'
import ReactDOM from 'react-dom'
function Loader() {
    return ReactDOM.createPortal(
        <div className={styles.wrapper}>
            <div className={styles.loader}>
                <img src={loaderImg} alt="Loading..."/>
            </div>
        </div> , 
        document.getElementById('loader')
    )
}

export default Loader