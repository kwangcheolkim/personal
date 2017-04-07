declare module microsoft.learning.mlx {

    enum SearchEventTypes {
        searchBox = 1,
        infiniteScroll = 2,
        sortOrder = 3,
        selectCriteriaApplied = 4,
        selectCriteriaRemoved = 5,
        firstSearch = 6,
        resetFilters = 7,
        reSearch = 8
    }

    export class CourseSearchViewModel {

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
        removeSelectItem(data, event);
        processFilterForTracking(filter, selectedTerm);
        enableDisableTechnologies();
        removeFromSelectCriteria(header);
        enableCheckBoxes();
        disableCheckBoxes();
        setLanguagePreference(lcid, updatedLanguagePreferences);
        removeLanguagePreference(lcid, updatedLanguagePreferences);
        clearLanguagePreferences(lcid, userId);
        setSelectedSortItem(sortItem);
        getLearningPlansByUser();
        showAddMenu(data, event);
        showHideFilterDropdown(data, hideAll);
        switchOverlay(visible);
        setResultsContainerHeight();
        setDivNarrowByHeight();
        decodeURLRecursively(url);
    }

}


//declare module "coursesearch" {
//    export = microsoft.learning.mlx.CourseSearchViewModel;
//}

