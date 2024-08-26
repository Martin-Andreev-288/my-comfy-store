type ConstructUrlParams = {
    pageNumber: number;
    search: string;
    pathname: string;
};
// Construct URL. Completing the pagination. The pagination already works.
// The final goal is to add the selected page in the URL,
// for example - if we are on page one, it must add page=1, if we are on page
// 2, it must add page=2. Look at the app in right.
export const constructUrl = ({
    pageNumber,
    search,
    pathname,
}: ConstructUrlParams) => {
    const searchParams = new URLSearchParams(search);
    searchParams.set('page', pageNumber.toString());

    return `${pathname}?${searchParams.toString()}`;
};

type ConstructPrevOrNextParams = {
    currentPage: number;
    pageCount: number;
    search: string;
    pathname: string;
};

export const constructPrevOrNextUrl = ({
    currentPage,
    pageCount,
    search,
    pathname,
}: ConstructPrevOrNextParams): { prevUrl: string; nextUrl: string } => {
    let prevPage = currentPage - 1;
    if (prevPage < 1) prevPage = pageCount;
    const prevUrl = constructUrl({ pageNumber: prevPage, search, pathname });

    let nextPage = currentPage + 1;
    if (nextPage > pageCount) nextPage = 1;
    const nextUrl = constructUrl({ pageNumber: nextPage, search, pathname });
    return { prevUrl, nextUrl };
};