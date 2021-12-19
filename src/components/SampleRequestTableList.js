import React, { useState } from "react";
import styled, { css } from "styled-components";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import dayjs from "dayjs";

import SampleRequestTableDetail from "components/brand/sample_request/SampleRequestTableDetail";
import utils from "utils";

import NoimgLogo from "assets/noimage/noimg_logo_b.svg";

const Body = styled.div`
    width: 100%;
    height: 112px;
    border-bottom: 1px solid #dddddd;
    display: flex;
    align-items: center;
    margin-right: 30px;
    cursor: pointer;
`;

const List = styled.div`
    width: ${(props) => props.width || "auto"};
    margin: 0 20px;
    font-size: 14px;
    font-weight: ${(props) => props.weight || "normal"};
    display: flex;
    justify-content: center;
`;

const LogoImg = styled.img`
    max-height: 20px;
    max-width: 60px;
`;

const ThumbImg = styled.div`
    width: 48px;
    height: 72px;
    border: solid 1px #dddddd;
    ${(props) =>
        props.imgUrl !== null
        ? css`
        background: url("${(props) => props.imgUrl}") no-repeat center;
        background-size: contain;
        background-color: #e7e7e7;
        `
        : css`
        background-color: #dddddd;
    `}
`;

const Circle = styled.div`
    width: 72px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: ${(props) => props.circleColor || "#7ea1b2"};
`;

function SampleRequestTableList({data,openYn,// circleColor
}) {
    const [open, setOpen] = useState(openYn);
    return (
    <>
        <Body onClick={() => setOpen(!open)} OnTap={() => setOpen(!open)}>
            <List width="10%">
                <Circle circleColor={data.mgzn_color}>
                    {
                        data.mgzn_logo_url_adres.includes('public') ?
                        <LogoImg src={data.mgzn_logo_url_adres} alt="logo" />
                        :
                        <LogoImg src={NoimgLogo} alt="logo" />
                    }
                    
                </Circle>
            </List>
            <List width="10%">
                <ThumbImg imgUrl={data.thumnail_image_url} />
            </List>
            <List width="20%" weight="500">
                {data.req_user_nm}
            </List>
            <List width="24%">{data.mgzn_nm}</List>
            <List width="22%">
                <div style={{display: "flex",flexDirection: "column",alignItems: "center",}}>
                    <div>{data.contact_user_nm}</div>
                    <div>{utils.phoneFormat(data.contact_phone_no)}</div>
                </div>
            </List>
            <List width="10%">
                {dayjs.unix(data.request_date).format("YYYY-MM-DD")}
            </List>
            <List width="4%">{open ? <ExpandLessIcon /> : <ExpandMoreIcon />}</List>
        </Body>
        {
            open && (
                <SampleRequestTableDetail
                    open={open}
                    setOpen={setOpen}
                    req_no={data.req_no}
                />
            )}
    </>
    );
}

export default React.memo(SampleRequestTableList);
