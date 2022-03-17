import React from "react";
import { useQuery } from "react-query";

import { apiObject } from "api/api_brand";
import EditComponent from "components/brand/lookbook/EditComponent";
import Progress from "components/common/progress";

export default function LookBookEdit({ match }) {
  const lookbookDetailQuery = useQuery(
    ["lookbook-detail-edit", match.params.lookbook_no],
    async () =>
      await apiObject.getLookbookDetail({
        lookbook_no: match.params.lookbook_no,
        page: 1,
        limit: 50, // 무한스크롤 X
      })
  );

  const detailData = lookbookDetailQuery.isLoading
    ? []
    : lookbookDetailQuery.data;

  if (lookbookDetailQuery.isLoading) {
    return <Progress type="load" />;
  }

  return (
    // <>
    <EditComponent data={detailData} lookbookNo={match.params.lookbook_no} />
    // </>
    // <NewEdit detailData={detailData} />

    // <>
    //   <TitelWrap>
    //     <Title>LookBook</Title>
    //   </TitelWrap>
    //   <InputContainer width={size}>
    //     <InputWrap>
    //       <InputTitle>Title</InputTitle>
    //       <InputTextField
    //         variant="outlined"
    //         placeholder="Title"
    //         value={inputs.lookbook_nm}
    //         name="title"
    //         onChange={handleChange}
    //       />
    //     </InputWrap>
    //     <InputWrap>
    //       <InputTitle>Caption</InputTitle>
    //       <CaptionWrap ref={ref}>
    //         <MainMenu onClick={() => setSelectOpen(!selectOpen)}>
    //           <div>{inputs.caption}</div>
    //           {selectOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
    //         </MainMenu>
    //         {selectOpen && (
    //           <SubMenu>
    //             {CAPTION_OPTIONS.map((d) => (
    //               <div key={d} onClick={() => handleSelectbox(d)}>
    //                 {d}
    //               </div>
    //             ))}
    //           </SubMenu>
    //         )}
    //       </CaptionWrap>
    //     </InputWrap>
    //     <InputWrap>
    //       <InputTitle>Season</InputTitle>
    //       <CaptionWrap ref={seasonRef}>
    //         <MainMenu onClick={() => setSelectSeasonOpen(!selectSeasonOpen)}>
    //           <div>{inputs.season}</div>
    //           {selectSeasonOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
    //         </MainMenu>
    //         {selectSeasonOpen && (
    //           <SubMenu>
    //             {SEASON_OPTIONS.map((d) => (
    //               <div key={d} onClick={() => handleSelectSeasonbox(d)}>
    //                 {d}
    //               </div>
    //             ))}
    //           </SubMenu>
    //         )}
    //       </CaptionWrap>
    //     </InputWrap>
    //     <InputWrap>
    //       <InputTitle>Gender</InputTitle>
    //       <CaptionWrap ref={genderRef}>
    //         <MainMenu onClick={() => setSelectGenderOpen(!selectGenderOpen)}>
    //           <div>{inputs.gender}</div>
    //           {selectGenderOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
    //         </MainMenu>
    //         {selectGenderOpen && (
    //           <SubMenu>
    //             {GENDER_OPTIONS.map((d) => (
    //               <div key={d} onClick={() => handleSelectGenderbox(d)}>
    //                 {d}
    //               </div>
    //             ))}
    //           </SubMenu>
    //         )}
    //       </CaptionWrap>
    //     </InputWrap>
    //     <InputWrap>
    //       <InputTitle>Made For</InputTitle>
    //       <InputTextField
    //         variant="outlined"
    //         placeholder="Made For"
    //         value={inputs.made_for}
    //         name="madeFor"
    //         onChange={handleChange}
    //       />
    //     </InputWrap>
    //   </InputContainer>

    //   <ItemContainer>
    //     {inputs.list.length > 0 &&
    //       inputs.list.map((d) => (
    //         <Items
    //           key={d.item_no}
    //           data={d}
    //           //   handleDeleteItem={handleSelectData}
    //         />
    //       ))}
    //   </ItemContainer>

    //   <BottomWrap>
    //     <BtnWrap type="cancel" onClick={handleCancelBtn}>
    //       <BtnImgWrap>
    //         <img src={CancelIcon} alt="close"></img>
    //       </BtnImgWrap>
    //       <CancelTxt>Cancel</CancelTxt>
    //     </BtnWrap>
    //     <BtnWrap type="confirm">
    //       <ConfirtTxt>Save</ConfirtTxt>
    //     </BtnWrap>
    //     <BtnWrap type="confirm">
    //       <ConfirtTxt>Save As</ConfirtTxt>
    //     </BtnWrap>
    //   </BottomWrap>
    // </>
  );
}

// function useWindowWidth() {
//   const [widthSize, setWidthSize] = useState(undefined);

//   useEffect(() => {
//     function handleResize() {
//       setWidthSize(window.innerWidth);
//     }

//     window.addEventListener("resize", handleResize);

//     handleResize();

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return widthSize;
// }
