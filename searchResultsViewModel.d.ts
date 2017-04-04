declare class SearchResultsViewModel {

    constructor();
    setResultsContainerHeight(): void;
    setDivNarrowByHeight(): void;

    initializeUI(parentModel: CourseSearchViewModel): void;
    setSearchProperties(parentModel: CourseSearchViewModel): void;
    enableDisableTechnologies(parentModel: CourseSearchViewModel): void;

}

declare enum SearchEventTypes {
    firstSearch,
    searchBox
}

declare class CourseSearchViewModel {

    constructor(searchModel: SearchModel, childViewModel: SearchResultsViewModel, overlay: OverlayViewModels);
    updateURL(searchEventType: SearchEventTypes): void;
    isValidSortOrder(sortValue: string): boolean;
    isValidIndex(value: any): boolean;

    searchResult(item, parentModel, searchText, userLearningPlans, isUserMigrated, isMigrationStarted, isMigrationCompleted, searchRank);
    narrowBySection(item, parentModel: CourseSearchViewModel);
    narrowByInfo(item, parentHeader);

    learningPlan(item, parentModel: CourseSearchViewModel);
    learningPlanItem(item, parentModel: CourseSearchViewModel);

    search(searchEventType: SearchEventTypes, sourceHeader);
    displayError(error: string);
    setSearchProperties();
    initialize();
    initializeUI();

    bindResults(searchEventType: SearchEventTypes, sourceHeader: string);

    checkItemsBySelectCriteria();
    resetFilters();
    resetAllFilters();

    refreshFilters(searchEventType: SearchEventTypes, sourceHeader: string);
    showSortOptions(element, event);
    setAriaAttributesClosed(triggerElement);
    setAriaAttributesOpened(triggerElement);
    hideFilters(data, hideAll); 

    applyLearningPlan(data, index);
    setSortCriteria(sortOnField, sortOrder);
    setSelectItem(data);

}