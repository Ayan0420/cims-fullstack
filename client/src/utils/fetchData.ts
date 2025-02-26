// import axios, { AxiosRequestConfig } from "axios";

// /**
//  * Utility function for making API requests using Axios.
//  * @param url - API endpoint
//  * @param options - Axios request configuration
//  * @returns Promise<T> - Resolves with typed response data
//  */
// async function fetchData<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
//   try {
//     const response = await axios({ url, ...options });
//     return response.data;
//   } catch (error: any) {
//     if (axios.isAxiosError(error)) {
//       throw new Error(error.response?.data?.message || "Request failed");
//     }
//     throw new Error("An unexpected error occurred");
//   }
// }

// export default fetchData;
