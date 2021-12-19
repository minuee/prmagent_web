import { Box, Button, makeStyles } from "@material-ui/core";
import { apiObject } from "api/api_stylist";
import dayjs from "dayjs";
import React, { Fragment } from "react";
import { useQuery } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  @media (min-width: 1920px) {
    width: 1480px
  }
  @media (min-width: 1440px) and (max-width: 1919px) {
    width: 950px
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    width: 600px
  }  
`;

const QuestionWrap = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 56px;
`;

const useStyles = makeStyles((theme) => ({
  listButton: {
    minWidth: 200,
    padding: theme.spacing(2),
    fontSize: 16,
  },
}));
export default function NoticeDetailPage() {
  const classes = useStyles();
  const history = useHistory();
  const { notice_no } = useParams();
  const handleListButtonClick = () => {
    history.push("/stylist/notice");
  };
  const noticeDetailQuery = useQuery(["notice", "detail", notice_no], () =>
    apiObject.getNoticeDetail({ notice_no })
  );
  return (
    <Container>
      <QuestionWrap>
        <Title>Notice</Title>
        {noticeDetailQuery.isLoading ? (
          ""
        ) : (
          <Fragment>
            <Box
              display="flex"
              justifyContent="space-between"
              paddingX={2.5}
              paddingY={2}
              borderTop="1px solid #ededed"
              borderBottom="1px solid #ededed"
            >
              <Box>{noticeDetailQuery.data.title}</Box>
              <Box color="#999999">
                {dayjs.unix(noticeDetailQuery.data.reg_dt).format("YYYY.MM.DD")}
              </Box>
            </Box>
            <Box
              p={2}
              bgcolor={"#f7f8fa"}
              mb={7.5}
              style={{ padding: "16px 20px 40px 20px" }}
            >
              {noticeDetailQuery.data.img_full_url && (
                <img
                  style={{
                    width: "40%",
                    display: "block",
                    paddingBottom: "2em",
                  }}
                  src={noticeDetailQuery.data.img_full_url}
                />
              )}
              {noticeDetailQuery.data.content}
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Button
                className={classes.listButton}
                variant="contained"
                color="secondary"
                onClick={handleListButtonClick}
              >
                List
              </Button>
            </Box>
          </Fragment>
        )}
      </QuestionWrap>
    </Container>
  );
}
