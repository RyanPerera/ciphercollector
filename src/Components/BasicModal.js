import { useState, React } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import './BasicModal.css';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import Hover from './Hover';

const skillButtons = {
    "\\|AUTO\\|": `<img title='AUTO' style='display: inline-block; vertical-align: middle;' src="${require('../Assets/skillbuttons/AUTO.png')}"/>`,
    "\\|ACT\\|": `<img title='ACT' style='display: inline-block; vertical-align: middle;' src="${require('../Assets/skillbuttons/Activate.png')}"/>`,
    //"\\|SUPPORT\\|": `<img title='AUTO' style='display: inline-block; vertical-align: middle;' src="${require('../Assets/skillbuttons/AUTO.png')}"/>`,
    "\\|CONT\\|": `<img title='CONT' style='display: inline-block; vertical-align: middle;' src="${require('../Assets/skillbuttons/Continuous.png')}"/>`,
    "\\|CCS\\|": `<img title='CCS' style='display: inline-block; vertical-align: middle;' src="${require('../Assets/skillbuttons/CCS.png')}"/>`,
    "\\[CCS\\]": `<img title='CCS' style='display: inline-block; vertical-align: middle;' src="${require('../Assets/skillbuttons/CCS.png')}"/>`,
    "\\[HS\\]": `<img title='HS' style='display: inline-block; vertical-align: middle;' src="${require('../Assets/skillbuttons/HeroSkill.png')}"/>`,
    "\\[Once Per Turn\\]": `<img title='Once Per Turn' style='display: inline-block; vertical-align: middle;' src="${require('../Assets/skillbuttons/OncePerTurn.png')}"/>`,
    "Flip 1 Bond face\\-down": `<img title='Flip 1 Bond face-down' style='display: inline-block; vertical-align: middle;' src="${require('../Assets/skillbuttons/Flip1.png')}"/>`,
    "Flip 2 Bonds face\\-down": `<img title='Flip 2 Bonds face-down' style='display: inline-block; vertical-align: middle;' src="${require('../Assets/skillbuttons/Flip2.png')}"/>`,
    "Flip 3 Bonds face\\-down": `<img title='Flip 3 Bonds face-down' style='display: inline-block; vertical-align: middle;' src="${require('../Assets/skillbuttons/Flip3.png')}"/>`,
    "Tap this unit": `<img title='Tap this unit' style='display: inline-block; vertical-align: middle;' src="${require('../Assets/skillbuttons/Tap.png')}"/>`,
    "\\|ATK\\/DEF SUPP\\|": `<img title='ATK/DEF SUPP' style='display: inline-block; vertical-align: middle;' src="${require('../Assets/skillbuttons/AtkDef.png')}"/>`,
    "\\|ATK SUPP\\|": `<img title='ATK SUPP' style='display: inline-block; vertical-align: middle;' src="${require('../Assets/skillbuttons/AttackSupport.png')}"/>`,
}

export default function BasicModal(props) {
    const [open, setOpen] = useState(false);
    const [foil, setFoil] = useState(false);
    const [holo, setHolo] = useState(false);
    const [noise, setNoise] = useState(false);

    const handleOpen = () => {
        switch (props.rarity) {
            case "SR+":
            case "SR":
            case "ST+":
            case "R+":
            case "HNX":
            case "R+X":
            case "N+X":
            case "+X":
            case "PR+":
                setFoil(true)
                setHolo(true)
                setNoise(true)
                break;
            case "R":
            case "HR":
            case "PRr":
                setFoil(false)
                setHolo(true)
                setNoise(true)
                break;
            case "N":
            case "HN":
            case "ST":
            case "PR":
                setFoil(false)
                setHolo(false)
                setNoise(false)
                break;
            default:
                setFoil(false)
                setHolo(false)
                setNoise(false)
                break;
        }

        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    let name = props.name.split(',')
    name[1] = name[1].trimStart()
    const num = props.num.split('_')[0].replace("plus", "+")


    function SkillText(text) {
        let replacedSkill = text.text.toString()
        let title = replacedSkill.replace(/^(?:\[[^\]]*\]|\|[^|]*\|)/, '').split(/[|:]/)
        title = title[0].trim()

        let replacetitle = `<span style="font-weight: 700;" class="skillName">${title}</span>`
        const regex = new RegExp(title, 'gi');
        replacedSkill = replacedSkill.replace(regex, replacetitle);

        Object.keys(skillButtons).forEach((key) => {
            const regex = new RegExp(key, 'gi');
            replacedSkill = replacedSkill.replace(regex, skillButtons[key]);
        })
        return (
            <div className='skill'>
                <div dangerouslySetInnerHTML={{ __html: replacedSkill }} />
            </div>
        )
    }

    return (
        <div className='cardbox'>
            <img src={props.url} alt={props.name} onClick={handleOpen} />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className='cardboxlarge'>

                    <div className='close'>
                        <CloseIcon onClick={handleClose} />
                    </div>

                    <Hover >
                        <div className='effects'>
                            {foil ? <div className='foil' /> : <></>}
                            {noise ? <div className="noise" /> : <></>}
                            {holo ? <div className='holo' /> : <></>}
                        </div>
                        <img src={props.url} alt={props.name} />
                    </Hover>

                    <div className='cardinfo'>
                        <div className='title'>
                            {name[0]}<br />
                            <span style={{ fontSize: 'x-large', fontWeight: '400', color: '#111111' }}>{name[1]} </span>
                        </div>

                        <div className='infobar'>
                            <Box sx={cstyle1} title="Set">
                                {props.set}
                            </Box>
                            <Box sx={cstyle1} title="Card Number">
                                {num}
                            </Box>
                            <Box sx={cstyle2} title="Rarity">
                                {props.rarity}
                            </Box>
                        </div>
                        <Box sx={cstyle3} title="Add to Collection" className='collection'>
                            <CheckCircleOutlineIcon sx={{ position: 'relative', top: '5px', zIndex: '1' }} />
                            In Collection
                        </Box>

                        <div className="skills">
                            {props.skill1 !== "-" ? <SkillText text={props.skill1} /> : <></>}
                            {props.skill2 !== "-" ? <SkillText text={props.skill2} /> : <></>}
                            {props.skill3 !== "-" ? <SkillText text={props.skill3} /> : <></>}
                            {props.skill4 !== "-" ? <SkillText text={props.skill4} /> : <></>}
                        </div>
                    </div>
                </Box>
            </Modal>
        </div >
    );
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vh',
    bgcolor: 'background.paper',
    boxShadow: 24,
    outline: 0,
    borderRadius: '12px',
    p: 4,
    transition: 'all 2s'

};


const cstyle1 = {
    backgroundColor: '#15AAD7',
    display: 'block',
    padding: '3px 5px 6px 5px',
    color: 'white',
    border: 'solid 3px #0F7391',
    fontSize: 'larger',
    width: '25px',
    minWidth: 'fit-content',
    textAlign: 'center',
    borderRadius: '12px'
}

const cstyle2 = {
    display: 'block',
    padding: '3px 5px 6px 5px',
    color: 'black',
    border: 'solid 3px #0F7391',
    fontSize: 'larger',
    width: '25px',
    minWidth: 'fit-content',
    textAlign: 'center',
    borderRadius: '12px'
}

const cstyle3 = {
    display: 'block',
    padding: '3px 5px 10px 5px',
    border: 'solid 3px',
    width: '25px',
    minWidth: 'fit-content',
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius: '30px',
    marginTop: '10px'
}