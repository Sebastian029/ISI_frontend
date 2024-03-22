import styles from './MainFinder.module.css'
import PropTypes from 'prop-types';

import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TuneIcon from '@mui/icons-material/Tune';
import { useState } from 'react';

function MainFinder({activateFinder}){
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');

    const handleSwap = () => {
        const temp = value1;
        setValue1(value2);
        setValue2(temp);
    };
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

                <div className={styles.destinationInputRow}>
                    <input className={styles.textInput} type="text" value={value1} onChange={(e) => setValue1(e.target.value)} placeholder='Depature'/>
                    <SwapHorizIcon className={styles.icon}  onClick={handleSwap} />
                    <input className={styles.textInput} type="text" value={value2} onChange={(e) => setValue2(e.target.value)} placeholder='Arrival'/>
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