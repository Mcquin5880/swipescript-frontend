import { HttpParams, HttpResponse } from "@angular/common/http";
import { signal } from "@angular/core";
import { PaginatedResult } from "../_models/pagination";

export function setPaginatedResponse<T>(
  response: HttpResponse<any>,
  paginatedResultSignal: ReturnType<typeof signal<PaginatedResult<T> | null>>
) {
  const paginationHeader = response.headers.get('Pagination');

  if (!paginationHeader) {
    console.warn('Pagination header is missing from the response.');
    return;
  }

  try {
    const pagination = JSON.parse(paginationHeader);

    paginatedResultSignal.set({
      // Extract `content` from `response.body` to get the actual data array
      items: response.body.content as T,
      pagination: pagination,
    });
  } catch (error) {
    console.error('Error parsing Pagination header:', error);
  }
}

export function setPaginationHeaders(pageNumber: number, pageSize: number) {
  let params = new HttpParams();

  if (pageNumber && pageSize) {
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
  }

  return params;
}
