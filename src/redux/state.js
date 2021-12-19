import { atom } from "recoil";
import moment from "moment";
export const currentDrawer = atom({
	key: "currentDrawer",
	default: false // 열린상태가 false;;;;잘못설정햇다 처음부터;;;
});

export const currentToggleShow = atom({
	key: "currentToggleShow",
	default: false 
});

export const currentPage = atom({
	key: "currentPage",
	default: 1,
	// default: "NOT_SIGN",
});
export const currentQuestionPage = atom({
	key: "currentQuestionPage",
	default: 1,
	// default: "NOT_SIGN",
});

export const currentPageName = atom({
	key: "currentPageName",
	default: null,
	// default: "NOT_SIGN",
});

export const currentStartDt = atom({
	key: "currentStartDt",
	default:  moment().weekday(0),	
});

export const currentEndDt = atom({
	key: "currentEndDt",
	default:  moment().weekday(6),	
});

export const currentPickupStartDt = atom({
	key: "currentPickupStartDt",
	default:  moment().weekday(0),	
});

export const currentPickupEndDt = atom({
	key: "currentPickupEndDt",
	default:  moment().weekday(6),	
});

//Send Out Main Title
export const currentSendOutSelect = atom({
	key: "currentSendOutSelect",
	default: "Send Out",
});

//Send Out Main Title
export const currentShowRoomSelect = atom({
	key: "currentShowRoomSelect",
	default: {
		season_year: "",
		season_cd_id: "",
		label: "",
	}
});

//Press Release
export const currentPressSelect = atom({
	key: "currentPressSelect",
	default: {
		year: "",
		month: "",
	}
});

//Magazine Pickup
export const currentPickupMenu = atom({
	key: "currentPickupMenu",
	default: 'pickups'
});
export const currentPickupSelect = atom({
	key: "currentPickupSelect",
	default: ''
});

//Sample Request
export const currentSeqno = atom({
	key: "currentSeqno",
	default: null
});
export const currentAcceptList = atom({
	key: "currentAcceptList",
	default: []
});
export const currentRejectList = atom({
	key: "currentRejectList",
	default: []
});


export const selectTarget = atom({
	key: "selectTarget",
	default: [] 
});

//filter
export const currentfilterSubmenu = atom({
	key: "currentfilterSubmenu",
	default: 'Category'
});
export const currentSelectGender = atom({
	key: "currentSelectGender",
	default: []
});
export const currentSelectCategory = atom({
	key: "currentSelectCategory",
	default: []
});
export const currentCheckCategoryAll = atom({
	key: "currentCheckCategoryAll",
	default: {
		rtw: false,
		bag: false,
		deco: false,
		acc: false,
		jewelry: false,
		shoes: false
	}
});
export const currentSelectMaterial = atom({
	key: "currentSelectMaterial",
	default: []
});
export const currentCheckMaterialAll = atom({
	key: "currentCheckMaterialAll",
	default: false
});
export const currentSelectColor = atom({
	key: "currentSelectColor",
	default: []
});
export const currentCheckColorAll = atom({
	key: "currentCheckColorAll",
	default: false
});
export const currentSelectSize = atom({
	key: "currentSelectSize",
	default: []
});
export const currentCheckSizeAll = atom({
	key: "currentCheckSizeAll",
	default:{
		rtw: false,
		womenShoes: false,
		menShoes: false
	}
});

/* Scheduler */
export const currentStartDate = atom({
	key: "currentStartDate",
	default: false
});
export const currentEndDate = atom({
	key: "currentEndDate",
	default: false
});
