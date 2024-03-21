import styles from './TopBar.module.css'

function TopBar(){
    return(
        <>
            <div className={styles.mainBox}>
                    <div className={styles.box}>Help</div>
                    <div className={styles.box}>Favourites</div>
                    <div className={styles.box}>My reservations</div>
                    <div className={styles.box}>Account</div>
            </div>
        </>
    );
}

export default TopBar