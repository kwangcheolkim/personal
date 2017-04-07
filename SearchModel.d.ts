declare module microsoft.learning.mlx {

    export class SearchModel {
        SelectCriteria: Array<any>;
        DisplayFields: Array<any>;
        SortOptions: Array<any>;
        SearchKeyword: string;

        constructor();
        SelectCriterion(n, t, i);
        searchData();
        searchterm(t, i, r);
        anonymousSearchterm(t, i, r);
        AnonymousCourseSearch(t);
        decodeHtml(n);
        getAvailableCollectionIDs(n, t, i);
        getCollectionLocalized(n, t, i, r);
    }

}