const apiUrl = process.env.REACT_APP_API_URL || "";

export async function post<ResultType>({
  route,
  payload,
}: {
  route: string;
  payload: any;
}): Promise<ResultType | null> {
  const jwtToken = localStorage.getItem("rafartToken") || "";
  // console.log("route", `${apiUrl}/${route}`);
  try {
    const res = await fetch(`${apiUrl}/${route}`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: jwtToken,
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(payload),
    });

    return res.json();
  } catch {
    return null;
  }
}

export async function postFile<ResultType>({
  route,
  payload,
}: {
  route: string;
  payload: any;
}): Promise<ResultType | null> {
  const jwtToken = localStorage.getItem("rafartToken") || "";

  try {
    const res = await fetch(`${apiUrl}/${route}`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        // "Content-Type": "multipart/form-data",
        Authorization: jwtToken,
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: payload,
    });

    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

export async function get<ResultType>({
  route,
}: {
  route: string;
}): Promise<ResultType | null> {
  const jwtToken = localStorage.getItem("rafartToken") || "";

  try {
    const res = await fetch(`${apiUrl}/${route}`, {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: jwtToken,
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}
