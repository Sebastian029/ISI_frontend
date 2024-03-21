import styles from './MainFinder.module.css'

import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TuneIcon from '@mui/icons-material/Tune';

function TopBar(){
    return(
        <>
            <div className={styles.mainBox}>
                <div className={styles.checkBoxRow}>
                    <div>
                        <input type="checkbox"></input>
                        One direction
                    </div>
                    <div>
                        <input type="checkbox"></input>
                        Two direction
                    </div>
                </div>

                <div>
                    <input type="text"></input>
                    <SwapHorizIcon />
                    <input type="text"></input>
                </div>

                <div>
                    <input type="text"></input>
                    <input type="text"></input>
                    <input type="button" value={"asd"}></input>
                </div>
                
                <div>
                    <TuneIcon/>
                    <select>
                        <option>asd</option>
                    </select>

                </div>
                

            </div>
        </>
    );
}

export default TopBar