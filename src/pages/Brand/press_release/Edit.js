import React,{useEffect} from "react";
import styled from "styled-components";
import { Divider } from "@material-ui/core";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { apiObject } from "api/api_brand";
import EditComponent from "components/brand/press_release/EditComponent";
import Progress from "components/common/progress";

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentDrawer } from "redux/state";


const MainContainer = styled.div`
  width:calc(100%-25px);
  margin-left:25px;
  @media (min-width: 1920px) {
    min-width: ${(props) => (props.active ? "1920px" : "1560px")};
  }
  @media (min-width: 1440px) and (max-width: 1919px) {          
    min-width: ${(props) => (props.active ? "1250px" : "960px")};    
  }
  @media (min-width: 10px) and (max-width: 1439px) {
    min-width: ${(props) => (props.active ? "100%" : "100%")};  
  } 
`;


const Title = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #cccccc;
`;

const StyleDivider = styled(Divider)`
  height: 2px;
  background-color: #dddddd;
  margin: 18px 0 40px 0;
`;

export default function PressReleaseEdit({ match }) {
  const history = useHistory();
  const press_no = match.params.press_no;
  const [isdrawer, setIsDrawer] = useRecoilState(currentDrawer);

  /* useEffect(() => {
    console.log(history);
    const unblock = history.block("이 페이지를 나가시겠습니다?");
    return () => {
      unblock();
    };
  }, [history]); */

  // list call
  const pressDetailQuery = useQuery(
    ["brand-press-detail", press_no],
    async () => await apiObject.getPressDetail({ brand_press_no: press_no })
  );

  const detailData = pressDetailQuery.isLoading ? [] : pressDetailQuery.data;

  if (pressDetailQuery.isLoading) {
    return <Progress type="load" />;
  }

  return (
    <MainContainer active={isdrawer}>  
      <Title>Press Release</Title>
      <StyleDivider />

      <EditComponent press_no={press_no} data={detailData} idx={press_no} />
    </MainContainer>
  );
}
