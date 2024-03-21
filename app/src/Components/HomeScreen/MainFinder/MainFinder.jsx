import styles from './MainFinder.module.css'
import PropTypes from 'prop-types';

import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TuneIcon from '@mui/icons-material/Tune';

function MainFinder({activateFinder}){
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
                    <input type="button" value={"Search"} onClick={() => activateFinder(true)}></input>
                    <input type="button" value={"Clear"} onClick={() => activateFinder(false)}></input>
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

MainFinder.propTypes = {
    activateFinder: PropTypes.func.isRequired
  };

export default MainFinder