// const domain = "http://localhost:8080"; // 后端的部署地址

export const domain = "https://staybooking-backend.onrender.com";


// template string `${}`
// URL class: Url.xxParams.append(key: value) -> ?a=1

// 第一个版本
// export const login = (credential, asHost) => {
//     const loginUrl = `${domain}/authenticate/${asHost ? "host" : "guest"}`;

//     const statusOfApiResponse = fetch(loginUrl, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(credential),
//     }) 
//     // pending, fail, success
//     return statusOfApiResponse.then((response) => {
//         if (!response.ok) {
//             throw Error("Failed to Login");
//         }
//         return response.json();
//     }) ;
// }


// fetch + then 的真实类型链条（这是标准答案）
// fetch(url, options)
// → Promise<Response>   --- this is a return type of fetch

// Promise<Response>.then(
//   response => response.json()
// )
// → Promise<JS Object>  --- this is a return type of response.json()

// 第二个版本
// export const login = (credential, asHost) => {
//     const loginUrl = `${domain}/authenticate/${asHost ? "host" : "guest"}`;

//     return fetch(loginUrl, {
//         method: "POST",
//         headers: {
//            "Content-Type": "application/json",
//         },
//         body: JSON.stringify(credential),
//     }).then((response) => {
//         return response.text().then((text)=> {
//             if (!response.ok) {
//                 throw new Error(text || "Failed to Login");
//             }
//             return JSON.parse(text);

//         });
//     });
// }

// 第三个版本

export const login = (credential, asHost) => {
  const loginUrl = `${domain}/authenticate/${asHost ? "host" : "guest"}`; // template string `${}`

  return fetch(loginUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credential),
  }).then(async (response) => {
    const text = await response.text();

    if (!response.ok) {
      throw new Error(text || "Failed to Login");
    }

    return JSON.parse(text);
  });
};
// await + async 的真实类型链条（这是标准答案）
// fetch(url, options)
// → Promise<Response>   --- this is a return type of fetch 

export const register = (credential, asHost) => {
    const registerUrl = `${domain}/register/${asHost ? "host" : "guest"}`;

    return fetch(registerUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credential),
    }).then(async(response) => {
        const text = await response.text();
        if (!response.ok){
            throw new Error(text || "Failed to Register");
        }
        // register 成功一般不需要返回数据
        return;

        // 注册成功后直接登录
        // return login(credential, asHost);
    });
}; 

export const getReservations = () => {
    const authToken = localStorage.getItem("authToken");
    const listReservationsUrl = `${domain}/reservations`;

    return fetch(listReservationsUrl,{
        // method: "GET", fetch 默认就是 GET 方法
        headers: {
            "Authorization": `Bearer ${authToken}`,
        },
    }).then(async(response) => {
        const text = await response.text();
        if (!response.ok) {
            throw new Error (text || "Failed to get Reservations");
        }
        return text ? JSON.parse(text) : []; // 可能没有预订记录，返回空数组 render教材需要更改
    });
}

export const getStaysByHost = () => {
  const authToken = localStorage.getItem("authToken");
  const listStaysUrl = `${domain}/stays`;

  return fetch(listStaysUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then(async (response) => {
    const text = await response.text();

    if (!response.ok) {
      throw new Error(text || "Fail to get stay list");
    }

    // 204 / 空结果 → 空数组
    return text ? JSON.parse(text) : [];
  });
};

// URL class: Url.xxParams.append(key: value) -> ?a=1
// url.pathname      // "/search"
// url.search        // "?guest_number=2&lat=37"
// url.searchParams  // 参数对象

export const searchStays = (query) => {
    const authToken = localStorage.getItem("authToken");

    // ✅ 放在这里（fetch 之前）
    if (!authToken) {
        throw new Error("No auth token, please login again.");
    }

    const searchStaysUrl = new URL(`${domain}/search`);

    searchStaysUrl.searchParams.append("guest_number", query.guest_number);
    searchStaysUrl.searchParams.append("checkin_date", query.checkin_date.format("YYYY-MM-DD"));
    searchStaysUrl.searchParams.append("checkout_date",query.checkout_date.format("YYYY-MM-DD"));
    searchStaysUrl.searchParams.append("lat", 37);
    searchStaysUrl.searchParams.append("lon", -122);

    return fetch(searchStaysUrl.toString(), {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    }).then(async(response) => {
        const text = await response.text();

        if (!response.ok) {
            throw new Error(text || "Failed to search stays");
        }
        return text ? JSON.parse(text) : [];
    });

}

export const deleteStay = (stayId) => {
    const authToken = localStorage.getItem("authToken");
    const deleteStayUrl = `${domain}/stays/${stayId}`;

    return fetch(deleteStayUrl, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${authToken}`,
        },

    }).then(async (response) => {
        const text = await response.text();
        if (!response.ok) {
            throw new Error(text || "Failed to delete stay");
        }

        // DELETE 成功通常是 204 No Content（也可能 200）
        return;
    })

}

export const bookStay = (data) => {
  const authToken = localStorage.getItem("authToken");

  // 前置校验：需要登录
  if (!authToken) {
    throw new Error("No auth token, please login again.");
  }

  const bookStayUrl = `${domain}/reservations`;

  return fetch(bookStayUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(async (response) => {
    const text = await response.text();

    if (!response.ok) {
      throw new Error(text || "Fail to book reservation");
    }

    // POST /reservations 成功通常不需要返回数据
    return;
  });
};

// book 必须body里有data
// const data = {
//   stay_id: 12,
//   checkin_date: "2026-01-05",
//   checkout_date: "2026-01-07",
// };

export const cancelReservation = (reservationId) => {
  const authToken = localStorage.getItem("authToken");

  // 前置校验：需要登录
  if (!authToken) {
    throw new Error("No auth token, please login again.");
  }

  const cancelReservationUrl = `${domain}/reservations/${reservationId}`;

  return fetch(cancelReservationUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then(async (response) => {
    const text = await response.text();

    if (!response.ok) {
      throw new Error(text || "Fail to cancel reservation");
    }

    // DELETE 成功：200 / 204 都是正常
    return;
  });
};
// cancel 必须传 reservationId

export const getReservationsByStay = (stayId) => {
  const authToken = localStorage.getItem("authToken");

  // 前置校验：需要登录
  if (!authToken) {
    throw new Error("No auth token, please login again.");
  }

  const getReservationByStayUrl = `${domain}/stays/reservations/${stayId}`;

  return fetch(getReservationByStayUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then(async (response) => {
    const text = await response.text();

    if (!response.ok) {
      throw new Error(text || "Fail to get reservations by stay");
    }

    // GET list：204 / 空 body → []
    return text ? JSON.parse(text) : [];
  });
};
// getReservationsByStay 必须传 stayId

export const uploadStay = (data) => {
  const authToken = localStorage.getItem("authToken");

  // 前置校验：需要登录
  if (!authToken) {
    throw new Error("No auth token, please login again.");
  }

  const uploadStayUrl = `${domain}/stays`;

  return fetch(uploadStayUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      // ❗不要写 Content-Type
    },
    body: data, // FormData
  }).then(async (response) => {
    const text = await response.text();

    if (!response.ok) {
      throw new Error(text || "Fail to upload stay");
    }

    // POST 上传成功：通常不需要返回数据
    return;
  });
};

// upload 必须 body 里有 FormData 数据
// 为什么这里 不写 Content-Type（非常关键）
// 因为你这里的 data 是 FormData，不是 JSON。
// const data = new FormData();
// data.append("name", "My Stay");
// data.append("image", file);


// 是否要写 Content-Type，取决于：
// 1️⃣ 这个请求有没有 body
// 2️⃣ 如果有，body 是不是 JSON
