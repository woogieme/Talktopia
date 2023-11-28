import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { css } from "@emotion/react";

import Nav from '../../nav/Nav';

import style from "./Faq.module.css";
import useTokenValidation from '../../utils/useTokenValidation';

export default function Faq() {
  useTokenValidation();
  const { t } = useTranslation();
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const navigate: NavigateFunction = useNavigate();

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

    const guideStyles = css`
      font-family: 'Dovemayo_wild'; color: #012A4A; padding: 10px; font-weight: bold; font-size: 23px; text-align: center; margin-right: 30px
    `;

    const guideStyles1 = css`
    font-family: 'Dovemayo_wild'; color: #012A4A; padding: 10px; font-weight: bold; font-size: 23px; text-align: center; margin-right: 80px
  `;

  const guideStyles2 = css`
    font-family: 'Dovemayo_wild'; color: #012A4A; padding: 10px; font-weight: bold; font-size: 23px; text-align: center; margin-right: 10px
  `;

    const contextStyles = css`
      font-family: 'Dovemayo_wild';
      padding: 10px;
      font-size: 17px;
      margin-top: 5px;
      margin-left: 30px;
    `

    const contentStyles = css`
      font-family: 'Dovemayo_wild';
      color: #4b535a;
      padding: 10px;
      padding-left: 170px;
      padding-bottom: 30px;
      text-align:justify;
      font-size: 17px;
      float: left;
      font-weight: 600;
    `

  return (
    <>
    <div className={`${style.background}`}>
      <Nav/>
      <h2 className={`${style.title}`}>FAQ</h2>
      <div className={`${style.categoryGroup}`}>
        <span className={`${style.category}`} onClick={()=>{navigate('/faq')}}>FAQ</span>
        <span className={`${style.category}`} onClick={()=>{navigate('/counsel')}}>{t(`Faq2.counsel`)}</span>
      </div>
      <Accordion className={`${style.accordion}`} style={{ margin: '0 auto' }} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
          <Typography sx={{ width: '15%', flexShrink: 0, ...guideStyles}}>
            TalkTopia
          </Typography>
          <Typography sx={{ marginLeft: '30px', color: 'text.secondary' , ...contextStyles}}>{t(`Faq2.faq0`)}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{textAlign: 'left', marginLeft: '60px', marginRight: '10%', ...contentStyles}}>
          {t(`Faq2.faq1`)}
          {t(`Faq2.faq60`)}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={`${style.accordion}`} style={{ margin: '0 auto' }} expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2bh-content" id="panel2bh-header">
          <Typography sx={{ width: '15%', flexShrink: 0 , ...guideStyles}}>TalkTopia</Typography>
          <Typography sx={{ color: 'text.secondary' , ...contextStyles}}>
          {t(`Faq2.faq2`)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{textAlign: 'left', marginLeft: '100px', marginRight: '10%', ...contentStyles}}>
          {t(`Faq2.faq3`)}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={`${style.accordion}`} style={{ margin: '0 auto' }} expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography sx={{ width: '15%', flexShrink: 0 , ...guideStyles1}}>
          {t(`Faq2.faq4`)}
          </Typography>
          <Typography sx={{ color: 'text.secondary' , ...contextStyles}}>
          {t(`Faq2.faq5`)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography  sx={{textAlign: 'left', marginLeft: '15%', marginRight: '10%', ...contentStyles}}>
          {t(`Faq2.faq6`)}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={`${style.accordion}`} style={{ margin: '0 auto' }} expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography sx={{ width: '15%', flexShrink: 0 , ...guideStyles}}>{t(`Faq2.faq7`)}</Typography>
          <Typography sx={{ color: 'text.secondary' , ...contextStyles}}>
          {t(`Faq2.faq8`)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography  sx={{textAlign: 'left', marginLeft: '15%', marginRight: '10%', ...contentStyles}}>
          {t(`Faq2.faq9`)}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={`${style.accordion}`} style={{ margin: '0 auto' }} expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel5bh-content" id="panel5bh-header">
          <Typography sx={{ width: '15%', flexShrink: 0 , ...guideStyles}}>
          {t(`Faq2.faq10`)}
          </Typography>
          <Typography sx={{ color: 'text.secondary' , ...contextStyles}}>{t(`Faq2.faq11`)}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography  sx={{textAlign: 'left', marginLeft: '15%', marginRight: '10%', ...contentStyles}}>
          {t(`Faq2.faq12`)}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={`${style.accordion}`} style={{ margin: '0 auto' }} expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel6bh-content" id="panel6bh-header">
          <Typography sx={{ width: '15%', flexShrink: 0 , ...guideStyles}}>
          {t(`Faq2.faq13`)}
          </Typography>
          <Typography sx={{ color: 'text.secondary' , ...contextStyles}}>{t(`Faq2.faq14`)}</Typography>
        </AccordionSummary>
        <AccordionDetails >
          <Typography  sx={{textAlign: 'left', marginLeft: '15%', marginRight: '10%', ...contentStyles}}>
          {t(`Faq2.faq15`)}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={`${style.accordion}`} style={{ margin: '0 auto' }} expanded={expanded === 'panel7'} onChange={handleChange('panel7')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel7bh-content" id="panel7bh-header">
          <Typography sx={{ width: '15%', flexShrink: 0 , ...guideStyles2}}>
          {t(`Faq2.faq17`)}
          </Typography>
          <Typography sx={{ color: 'text.secondary' , ...contextStyles}}>{t(`Faq2.faq18`)}</Typography>
        </AccordionSummary>
        <AccordionDetails >
          <Typography sx={{textAlign: 'left', marginLeft: '15%', marginRight: '10%', ...contentStyles}}>
          {t(`Faq2.faq19`)}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={`${style.accordion}`} style={{ margin: '0 auto' }} expanded={expanded === 'panel8'} onChange={handleChange('panel8')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel8bh-content" id="panel8bh-header">
          <Typography sx={{ width: '15%', flexShrink: 0 , ...guideStyles1}}>
          {t(`Faq2.faq20`)}
          </Typography>
          <Typography sx={{ color: 'text.secondary' , ...contextStyles}}>{t(`Faq2.faq21`)}</Typography>
        </AccordionSummary>
        <AccordionDetails >
          <Typography sx={{textAlign: 'left', marginLeft: '15%', marginRight: '10%', ...contentStyles}}>
          {t(`Faq2.faq22`)}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={`${style.accordion}`} style={{ margin: '0 auto' }} expanded={expanded === 'panel9'} onChange={handleChange('panel9')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel9bh-content" id="panel9bh-header">
          <Typography sx={{ width: '15%', flexShrink: 0 , ...guideStyles1}}>
          {t(`Faq2.faq23`)}
          </Typography>
          <Typography sx={{ color: 'text.secondary' , ...contextStyles}}>{t(`Faq2.faq24`)}</Typography>
        </AccordionSummary>
        <AccordionDetails >
          <Typography sx={{textAlign: 'left', marginLeft: '15%', marginRight: '10%', ...contentStyles}}>
          {t(`Faq2.faq25`)}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={`${style.accordion}`} style={{ margin: '0 auto' }} expanded={expanded === 'panel10'} onChange={handleChange('panel10')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel10bh-content" id="panel10bh-header">
          <Typography sx={{ width: '15%', flexShrink: 0 , ...guideStyles1}}>
          {t(`Faq2.faqa`)}
          </Typography>
          <Typography sx={{ color: 'text.secondary' , ...contextStyles}}>{t(`Faq2.faqb`)}</Typography>
        </AccordionSummary>
        <AccordionDetails >
          <Typography sx={{textAlign: 'left', marginLeft: '15%', marginRight: '10%', ...contentStyles}}>
          {t(`Faq2.faqc`)}<br/>
          {t(`Faq2.faqd`)}<br/>
          {t(`Faq2.faqe`)}<br/>
          {t(`Faq2.faqw`)}<br/>
          {t(`Faq2.faqf`)}<br/>
          {t(`Faq2.faqg`)}<br/>
          {t(`Faq2.faqh`)}<br/>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={`${style.accordion}`} style={{ margin: '0 auto' }} expanded={expanded === 'panel11'} onChange={handleChange('panel11')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel101bh-content" id="panel11bh-header">
          <Typography sx={{ width: '15%', flexShrink: 0 , ...guideStyles1}}>
          {t(`Faq2.faq26`)}
          </Typography>
          <Typography sx={{ color: 'text.secondary' , ...contextStyles}}>{t(`Faq2.faq27`)}</Typography>
        </AccordionSummary>
        <AccordionDetails >
          <Typography sx={{textAlign: 'left', marginLeft: '15%', marginRight: '10%', ...contentStyles}}>
          {t(`Faq2.faq28`)}<br/>
          {t(`Faq2.faq29`)}<br/>
          {t(`Faq2.faq30`)}<br/>
          {t(`Faq2.faq31`)}<br/>
          {t(`Faq2.faq32`)}<br/>
          {t(`Faq2.faq33`)}<br/>
          {t(`Faq2.faq34`)}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <img className={`${style.friend11}`} src="/img/fish/fish7.png" alt=""></img>
        <img className={`${style.fish7}`} src="/img/fish/fish2.png" alt=""></img>
        <img className={`${style.fish2}`} src="/img/fish/friend11.png" alt=""></img>
        <img className={`${style.bubble1}`} src="/img/bubble/bubble1.png" alt=""></img>
        <img className={`${style.bubble2}`} src="/img/bubble/bubble2.png" alt=""></img>
        <img className={`${style.bubble3}`} src="/img/bubble/bubble3.png" alt=""></img>
        <img className={`${style.bubble4}`} src="/img/fish/turtle.png" alt=""></img>
        <img className={`${style.bubble5}`} src="/img/bubble/bubble3.png" alt=""></img>
    </div>
    </>
  );
}
