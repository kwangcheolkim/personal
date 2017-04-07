
declare namespace microsoft.learning.mlx {

    export class SearchResultsViewModel {

        constructor();
        setResultsContainerHeight(): void;
        setDivNarrowByHeight(): void;

        initializeUI(parentModel: CourseSearchViewModel): void;
        setSearchProperties(parentModel: CourseSearchViewModel): void;
        enableDisableTechnologies(parentModel: CourseSearchViewModel): void;

    }    

}



