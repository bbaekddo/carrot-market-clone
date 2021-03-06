module.exports = {

    // Success
    POST_SUCCESS : { "isSuccess": true, "code": 1000, "message":"데이터 생성 성공" },
    GET_SUCCESS : { "isSuccess": true, "code": 1001, "message":"데이터 조회 성공" },
    PUT_SUCCESS : { "isSuccess": true, "code": 1002, "message":"데이터 수정 성공" },
    DELETE_SUCCESS : { "isSuccess": true, "code": 1003, "message":"데이터 삭제 성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    // User Request Error
    SIGNUP_ID_EMPTY : { "isSuccess": false, "code": 2001, "message":"ID를 입력해주세요" },
    SIGNUP_ID_LENGTH : { "isSuccess": false, "code": 2002, "message":"ID는 20자리 미만으로 입력해주세요." },
    SIGNUP_ID_CHARACTER : { "isSuccess": false, "code": 2003, "message":"ID는 특수문자 없이 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 8~20자리를 입력해주세요." },
    SIGNUP_NAME_EMPTY : { "isSuccess": false, "code": 2006, "message":"이름을 입력해주세요" },
    SIGNUP_NAME_LENGTH : { "isSuccess": false, "code": 2007, "message":"이름은 10자리 미만으로 입력해주세요." },
    SIGNUP_NAME_CHARACTER : { "isSuccess": false, "code": 2008, "message":"이름은 특수문자 없이 입력해주세요." },
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2009, "message":"닉네임을 입력해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2010,"message":"닉네임은 20자리 미만으로 입력해주세요." },
    SIGNUP_NICKNAME_CHARACTER : { "isSuccess": false, "code": 2011, "message":"닉네임은 특수문자 없이 입력해주세요." },
    SIGNIN_ID_EMPTY : { "isSuccess": false, "code": 2012, "message":"ID를 입력해주세요" },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2013, "message": "비밀번호를 입력해주세요." },
    USER_USERIDX_EMPTY : { "isSuccess": false, "code": 2014, "message": "Index를 입력해주세요." },
    USER_USERIDX_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 사용자가 존재하지 않습니다." },
    USER_USERIDX_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "Index를 다시 확인해주세요" },
    USER_USERNICKNAME_EMPTY : { "isSuccess": false, "code": 2017, "message": "닉네임을 입력해주세요." },
    USER_USERNICKNAME_NOT_EXIST : { "isSuccess": false, "code": 2018, "message": "해당 회원이 존재하지 않습니다." },
    USER_USERNAME_EMPTY : { "isSuccess": false, "code": 2019, "message": "이름을 입력해주세요." },
    USER_USERNAME_NOT_EXIST : { "isSuccess": false, "code": 2020, "message": "해당 회원이 존재하지 않습니다." },
    USER_USERSTATUS_EMPTY : { "isSuccess": false, "code": 2021, "message": "사용자 상태를 입력해주세요." },
    USER_USERSTATUS_NOT_EXIST : { "isSuccess": false, "code": 2022, "message": "해당 회원이 존재하지 않습니다." },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2023, "message": "변경할 닉네임 값을 입력해주세요" },
    USER_IMAGE_NOT_MATCH : { "isSuccess": false, "code": 2024, "message": "프로필 사진 URL을 확인해주세요" },
    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2025, "message": "회원 상태값을 입력해주세요" },
    
    // Neighborhood Request Error
    NEIGHBORHOOD_LOCATION_EMPTY : { "isSuccess": false, "code": 2030, "message": "위치를 입력해주세요" },
    NEIGHBORHOOD_CONTENT_EMPTY : { "isSuccess": false, "code": 2031, "message": "내용을 입력해주세요" },
    NEIGHBORHOOD_TOPIC_EMPTY : { "isSuccess": false, "code": 2032, "message": "주제를 입력해주세요" },
    NEIGHBORHOOD_CONTENT_LENGTH : { "isSuccess": false, "code": 2033, "message": "내용은 20자 이내로 입력해주세요" },
    NEIGHBORHOOD_TOPIC_NOT_EXIST : { "isSuccess": false, "code": 2034, "message": "해당 주제의 동네 정보가 존재하지 않습니다." },
    NEIGHBORHOOD_ID_NOT_EXIST : { "isSuccess": false, "code": 2035, "message": "동네 정보가 존재하지 않습니다." },
    NEIGHBORHOOD_ID_EMPTY : { "isSuccess": false, "code": 2036, "message": "동네 정보 ID를 입력해주세요." },
    NEIGHBORHOOD_IDX_NOT_MATCH : { "isSuccess": false, "code": 2037, "message": "동네 정보 작성자가 아닙니다." },
    NEIGHBORHOOD_STATUS_NOT_MATCH : { "isSuccess": false, "code": 2038, "message": "동네 정보 상태를 확인해주세요." },
    NEIGHBORHOOD_IMAGE_NOT_EXIST : { "isSuccess": false, "code": 2039, "message": "동네 정보 사진 ID를 확인해주세요." },
    NEIGHBORHOOD_LOCATION_NOT_EXIST : { "isSuccess": false, "code": 2040, "message": "동네 정보 위치를 확인해주세요." },
    
    // Item Request Error
    ITEM_NAME_EMPTY : { "isSuccess": false, "code": 2050, "message":"상품 이름을 입력해주세요." },
    ITEM_CATEGORY_EMPTY : { "isSuccess": false, "code": 2051, "message":"상품 카테고리를 입력해주세요." },
    ITEM_PRICE_EMPTY : { "isSuccess": false, "code": 2052, "message":"상품 가격을 입력해주세요." },
    ITEM_LOCATION_EMPTY : { "isSuccess": false, "code": 2053, "message":"상품 위치를 입력해주세요." },
    ITEM_NAME_LENGTH : { "isSuccess": false, "code": 2054, "message":"상품 이름은 20자 이내로 입력해주세요." },
    ITEM_CONTENT_LENGTH : { "isSuccess": false, "code": 2055, "message":"상품 내용은 20자 이내로 입력해주세요." },
    ITEM_PRICE_TYPE_WRONG : { "isSuccess": false, "code": 2056, "message":"상품 가격은 숫자만 입력해주세요." },
    ITEM_CATEGORY_NOT_EXIST : { "isSuccess": false, "code": 2057, "message":"카테고리와 일치한 상품을 찾을 수 없습니다." },
    ITEM_ID_EMPTY : { "isSuccess": false, "code": 2058, "message":"상품 ID를 입력해주세요." },
    ITEM_IMAGE_EMPTY : { "isSuccess": false, "code": 2059, "message":"상품 사진을 입력해주세요." },
    ITEM_LOCATION_NOT_EXIST : { "isSuccess": false, "code": 2060, "message":"상품 위치를 확인해주세요." },
    ITEM_ID_NOT_MATCH : { "isSuccess": false, "code": 2061, "message":"상품 ID를 확인해주세요." },
    ITEM_USER_NOT_MATCH : { "isSuccess": false, "code": 2062, "message":"상품 작성자가 아닙니다." },
    ITEM_ITEMPOST_NOT_MATCH : { "isSuccess": false, "code": 2063, "message":"게시글 ID를 확인해주세요." },
    ITEM_ITEMPOST_NOT_EXIST : { "isSuccess": false, "code": 2064, "message":"게시글을 찾을 수 없습니다." },
    
    // Category Request Error
    CATEGORY_NOT_EXIST : { "isSuccess": false, "code": 2080, "message":"설정된 카테고리가 없습니다." },

    // User Response Error
    SIGNUP_REDUNDANT_ID : { "isSuccess": false, "code": 3001, "message":"중복된 ID 입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임 입니다." },
    SIGNIN_ID_WRONG : { "isSuccess": false, "code": 3003, "message": "ID가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴한 계정입니다. 고객센터에 문의해주세요." },
    DELETE_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3007, "message": "이미 탈퇴한 계정입니다." },

    // Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
}
