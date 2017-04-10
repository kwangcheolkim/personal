
var ResourceStrings = {
    SR_ResultsFor: 'Search Results for:',
    SR_NoResultsFor: 'There are no search results for:',
    AllCourses: 'All Courses',
    CP_Published: 'Published: ',
    byRelevance: 'by relevance',
    byPublishDate: 'by publish date',
    byPopularity: 'by popularity',
    byRatings: 'by ratings',
    byAtoZ: 'by a to z',
    MVA_ServiceUnavailableError: 'Server Error',
    MVA_ServiceUnavailableErrorHeading: 'Error',
    MVA_ServiceUnavailableClose: 'Close',
    MVA_Search_ServerError: 'The system cannot process your request and has timed out. Please try a different query.',
    SR_Level: 'Level',
    SR_Year: 'year',
    SR_Years: 'years',
    SR_Month: 'month',
    SR_Months: 'months',
    SR_Week: 'week',
    SR_Weeks: 'weeks',
    SR_Day: 'day',
    SR_Days: 'days',
    SR_Today: 'Today',
    SR_Ago: 'ago',
    SR_ComingSoon: 'Coming Soon',
    SR_Product: 'Product',
    SR_Topic: 'Topic',
    SR_Level: 'Level',
    SR_JobFunction: 'Job Function',
    SR_Language: 'Language',
    SR_ContentType: 'Content Type',
    SR_BrowseAllCourses: 'Browse all courses in the <a href="{SearchResultsUrl}">Microsoft Virtual Academy catalog</a>',
    SR_WeCouldNotFind: 'We couldn\'t find',
    CP_Instructors_And: 'and',
    CP_Instructors_Comma: ',',
    SR_ProductVersion: 'Product Version',
    PublishedTimeAgoTemplate: '{N} {Unit} {Text}',
    CourseLevelBeginner: 'Beginner',
    CourseLevelIntermediate: 'Intermediate',
    CourseLevelAdvanced: 'Advanced',
    CourseLevelExpert: 'Expert',
    AccessibilityStars: ' people have rated this course {number_star} out of 5 stars',
    RemoveItem: 'Remove '
};

var mvaConstants = {
    sortRelevance: 'Relevance',
    sortPublishedTime: 'PublishedTime',
    sortNumberOfStudents: 'TotalStudents',
    sortPopularity: 'Popularity',
    sortRating: 'StarRating',
    sortCourseName: 'CourseName',
    liveEvent: 'Live Event',
    lcid: 'LCID',
    topics: 'Topics',
    products: 'Technologies',
    productversion: 'TechnologiesCategory',
    audiences: 'Audiences',
    courseId: 'CourseId',
    courseName: 'CourseName',
    courseDuration: 'CourseDuration',
    courseImage: 'CourseImage',
    courseShortDescription: 'CourseShortDescription',
    courseLevel: 'CourseLevel',
    allCourses: 'AllCourses',
    numberOfStudents: 'TotalStudents',
    courseFormat: 'Format',
    eventType: 'EventType',
    searchSelectMatchOption: 2,
    topicCollectionId: 1,
    productCollectionId: 2,
    audienceCollectionId: 3,
    productVersionCollectionId: 4,
    //8- gets the courses specific to organization i.e mapped to organization offer
    catalogSourceAll: 8,
    defaultLanguageLCID: 1033,
    onTotalScrollOffset: 200,
    resolution_768x1366: [768, 1366],
    resolution_1366x768: [1366, 768],
    tileHeight: 173,
    tileWidth: 220,
    minTileContainerHeight: 346,
    animationDuration: 400,
    anonymous: 'AnonymousAuthenticated',
    authorized: 'MVA',
    dynamicTileCreationDefaultOffsetTop: 140,
    aspectRatioForVideoPlayer: 1.6, // = 730.0 / 456.0
    sortLiveEventsByDate: 0,
    sortLiveEventsByTitle: 1,
    eventTypeAll: 0,
    Name: 'Name',
    LocalizedName: 'LocalizedName',
    Count: 'Count',
    facebook: 'facebook',
    twitter: 'twitter',
    linkedin: 'linkedin',
    mail: 'mail'
};

var Configurations = {
    ItemsPerPage: '10',
    UserId: parseInt('') > 0 ? parseInt('') : 0,
    CoursePlayerUrlTemplate: 'https://{Host}/{LanguageCode}/training-courses/{FriendlyName}',
    SearchResultsUrlTemplate: 'https://{Host}/mva1.htm',
    RegisterUrlTemplate: 'https://{Host}/MyMVA/Register.aspx',
    MyProfileUrlTemplate: 'https://{Host}/MyMVA/MyProfile.aspx',
    DashboardUrlTemplate: 'https://{Host}/MyMVA/Dashboard.aspx',
    mvaApiTargetHostname: 'api-mva.microsoft.com',
    LCID: parseInt('1033'),
    mlxApiTargetHostname: 'api-mlxprod.microsoft.com',
    mobileResolution: 768,
    tabletResolution: 1024,
    idCountry: '1',
    userLCID: parseInt('0'),
    isMigratedUser: ('True' == 'True') ? true : false,
    isMigrationStarted: ('True' == 'True') ? true : false,
    isMigrationCompleted: ('True' == 'True') ? true : false,
    registerInMLX: ('True' == 'True') ? true : false,
    isMvaUserAuthenticated: ('False' == 'True') ? true : false,
    saveUserInformationInDb: ('True' == 'True') ? true : false,
    defaultLearningPlanName: 'My Learning Plan',
    pathName: '/mva1.htm',
    defaultSortOrder: 'Relevance'
};

var SearchEventTypes = {
    searchBox: 1,
    infiniteScroll: 2,
    sortOrder: 3,
    selectCriteriaApplied: 4,
    selectCriteriaRemoved: 5,
    firstSearch: 6,
    resetFilters: 7,
    reSearch: 8
};

var CourseLevels = {
    Beginner: 100,
    Intermediate: 200,
    Advanced: 300,
    Expert: 400
};

var SourceHeaders = {
    Audiences: 'Audiences',
    Format: 'Format',
    Technologies: 'Technologies',
    TechnologiesCategory: 'TechnologiesCategory',
    Topics: 'Topics',
    LCID: 'LCID',
    CourseLevel: 'CourseLevel',
    StarRating: 'StarRating'
};

var SearchResultsPage = true;
var UserLearningPlan = {};
var Languages = JSON.parse('[{"ID":1,"Name":"German","Culture":"de-DE","LanguageCodeMLX":"de-de","LCID":1031,"IDLanguageMLX":18},{"ID":2,"Name":"Russian","Culture":"ru-RU","LanguageCodeMLX":"ru","LCID":1049,"IDLanguageMLX":41},{"ID":3,"Name":"Chinese - Simplified","Culture":"zh-CN","LanguageCodeMLX":"zh-cn","LCID":2052,"IDLanguageMLX":6},{"ID":4,"Name":"Spanish","Culture":"es-ES","LanguageCodeMLX":"es-es","LCID":1034,"IDLanguageMLX":43},{"ID":5,"Name":"Portuguese (Brazil)","Culture":"pt-BR","LanguageCodeMLX":"pt-br","LCID":1046,"IDLanguageMLX":39},{"ID":6,"Name":"Polish","Culture":"pl-PL","LanguageCodeMLX":"pl","LCID":1045,"IDLanguageMLX":37},{"ID":7,"Name":"French","Culture":"fr-FR","LanguageCodeMLX":"fr-fr","LCID":1036,"IDLanguageMLX":16},{"ID":8,"Name":"Japanese","Culture":"ja-JP","LanguageCodeMLX":"ja","LCID":1041,"IDLanguageMLX":27},{"ID":9,"Name":"Turkish","Culture":"tr-TR","LanguageCodeMLX":"tr","LCID":1055,"IDLanguageMLX":48},{"ID":10,"Name":"Korean","Culture":"ko-KR","LanguageCodeMLX":"ko","LCID":1042,"IDLanguageMLX":29},{"ID":11,"Name":"Czech","Culture":"cs-CZ","LanguageCodeMLX":"cs","LCID":1029,"IDLanguageMLX":9},{"ID":12,"Name":"English","Culture":"en-US","LanguageCodeMLX":"en-US","LCID":1033,"IDLanguageMLX":12},{"ID":13,"Name":"Italian","Culture":"it-IT","LanguageCodeMLX":"it-it","LCID":1040,"IDLanguageMLX":26},{"ID":14,"Name":"Hungarian","Culture":"hu","LanguageCodeMLX":"hu","LCID":1038,"IDLanguageMLX":23},{"ID":15,"Name":"Chinese - Traditional","Culture":"zh-TW","LanguageCodeMLX":"zh-tw","LCID":1028,"IDLanguageMLX":7},{"ID":16,"Name":"Afrikaans","Culture":"af","LanguageCodeMLX":"af","LCID":1078,"IDLanguageMLX":1},{"ID":17,"Name":"Albanian","Culture":"sq","LanguageCodeMLX":"sq","LCID":1052,"IDLanguageMLX":2},{"ID":18,"Name":"Arabic","Culture":"ar","LanguageCodeMLX":"ar","LCID":1025,"IDLanguageMLX":3},{"ID":19,"Name":"Bangla","Culture":"bn","LanguageCodeMLX":"bn","LCID":2117,"IDLanguageMLX":4},{"ID":20,"Name":"Bulgarian","Culture":"bg","LanguageCodeMLX":"bg","LCID":1026,"IDLanguageMLX":5},{"ID":21,"Name":"Croatian","Culture":"hr","LanguageCodeMLX":"hr","LCID":1050,"IDLanguageMLX":8},{"ID":22,"Name":"Danish","Culture":"da","LanguageCodeMLX":"da","LCID":1030,"IDLanguageMLX":10},{"ID":23,"Name":"Dutch","Culture":"nl-nl","LanguageCodeMLX":"nl-nl","LCID":1043,"IDLanguageMLX":11},{"ID":24,"Name":"English (United Kingdom)","Culture":"en-GB","LanguageCodeMLX":"en-GB","LCID":2057,"IDLanguageMLX":13},{"ID":25,"Name":"Estonian","Culture":"et","LanguageCodeMLX":"et","LCID":1061,"IDLanguageMLX":14},{"ID":26,"Name":"Finnish","Culture":"fi","LanguageCodeMLX":"fi","LCID":1035,"IDLanguageMLX":15},{"ID":27,"Name":"French-Canada","Culture":"fr-CA","LanguageCodeMLX":"fr-CA","LCID":3084,"IDLanguageMLX":17},{"ID":28,"Name":"Greek","Culture":"el","LanguageCodeMLX":"el","LCID":1032,"IDLanguageMLX":19},{"ID":29,"Name":"Gujarati","Culture":"gu","LanguageCodeMLX":"gu","LCID":1095,"IDLanguageMLX":20},{"ID":30,"Name":"Hebrew","Culture":"he","LanguageCodeMLX":"he","LCID":1037,"IDLanguageMLX":21},{"ID":31,"Name":"Hindi","Culture":"hi","LanguageCodeMLX":"hi","LCID":1081,"IDLanguageMLX":22},{"ID":32,"Name":"Indonesian","Culture":"id","LanguageCodeMLX":"id","LCID":1057,"IDLanguageMLX":24},{"ID":33,"Name":"Irish","Culture":"ga","LanguageCodeMLX":"ga","LCID":2108,"IDLanguageMLX":25},{"ID":34,"Name":"Kannada","Culture":"kn","LanguageCodeMLX":"kn","LCID":1099,"IDLanguageMLX":28},{"ID":35,"Name":"Latvian","Culture":"lv","LanguageCodeMLX":"lv","LCID":1062,"IDLanguageMLX":30},{"ID":36,"Name":"Lithuanian","Culture":"lt","LanguageCodeMLX":"lt","LCID":1063,"IDLanguageMLX":31},{"ID":37,"Name":"Malay [Malaysia]","Culture":"ms-my","LanguageCodeMLX":"ms-my","LCID":1086,"IDLanguageMLX":32},{"ID":38,"Name":"Malayalam","Culture":"ml","LanguageCodeMLX":"ml","LCID":1100,"IDLanguageMLX":33},{"ID":39,"Name":"Norwegian","Culture":"no-no","LanguageCodeMLX":"no-no","LCID":2068,"IDLanguageMLX":34},{"ID":40,"Name":"Norwegian Bokmal","Culture":"nb-no","LanguageCodeMLX":"nb-no","LCID":1044,"IDLanguageMLX":35},{"ID":41,"Name":"Persian","Culture":"fa","LanguageCodeMLX":"fa","LCID":1065,"IDLanguageMLX":36},{"ID":42,"Name":"Portuguese","Culture":"pt-pt","LanguageCodeMLX":"pt-pt","LCID":2070,"IDLanguageMLX":38},{"ID":43,"Name":"Romanian","Culture":"ro","LanguageCodeMLX":"ro","LCID":1048,"IDLanguageMLX":40},{"ID":44,"Name":"Slovenian","Culture":"sl","LanguageCodeMLX":"sl","LCID":1060,"IDLanguageMLX":42},{"ID":45,"Name":"Spanish (Latin America)","Culture":"es-mx","LanguageCodeMLX":"es-mx","LCID":2058,"IDLanguageMLX":44},{"ID":46,"Name":"Swedish","Culture":"sv-se","LanguageCodeMLX":"sv-se","LCID":1053,"IDLanguageMLX":45},{"ID":47,"Name":"Tamil","Culture":"ta","LanguageCodeMLX":"ta","LCID":1097,"IDLanguageMLX":46},{"ID":48,"Name":"Thai","Culture":"th","LanguageCodeMLX":"th","LCID":1054,"IDLanguageMLX":47},{"ID":49,"Name":"Ukrainian","Culture":"uk","LanguageCodeMLX":"uk","LCID":1058,"IDLanguageMLX":49},{"ID":50,"Name":"Urdu","Culture":"ur","LanguageCodeMLX":"ur","LCID":1056,"IDLanguageMLX":50},{"ID":51,"Name":"Vietnamese","Culture":"vi","LanguageCodeMLX":"vi","LCID":1066,"IDLanguageMLX":51},{"ID":52,"Name":"Welsh","Culture":"cy","LanguageCodeMLX":"cy","LCID":1106,"IDLanguageMLX":52}]');


var IsUserMigrated = false;
var TrackPageLoad = true;
var PageLoadTrackingOptions = {
    IsLeaderboardView: false,
    IsBasicProfileView: false,
    IsProfileView: false,
    ShowTrackName: false,
    PageName: "search|search results",
    SiteSection: "search",
    Locale: "united states",
    AgentType: "desktop",
    OfferName: null,
    CourseFilter: null,
    TrackName: false ? TrackingConstants.courseNameTemplate.replace("{idMLX}", "0").replace("{courseName}", "") : null,
    TrackProduct: null,
    TrackTopic: null,
    Referrer: null,
    VideoTitle: null,
    LiveEventName: null,
    Audience: null,
    AudienceDetail: null,
    CourseTheme: null,
    UserType: 'null',
    recommendedSearchTerm: ''
}

var RegisterPageConfig = {
    DefaultCountryCode: 'US',
    DefaultLanguageCode: 'en-US',
    HlurlTermsOfUse: 'http://go.microsoft.com/fwlink/?LinkID=206977',
    HlurlPrivacyStatement: 'https://go.microsoft.com/fwlink/?LinkId=521839',
    AvailableUILCIDs: [1031, 1049, 2052, 1034, 1046, 1045, 1036, 1041, 1055, 1042, 1029, 1033, 1040, 1028],
    prePopulatedUserCountry: 'united states',
    prePopulatedUserLanguage: 'english',
    prePopulatedAcceptCommunication: 'no',
    countryName: 'United States'
};

var TechRewardConfig = {
    AllowRegisterTechRewards: ('False' == 'True') ? true : false
};


var searchViewModel = '';
var SearchResultsUrlTemplate = 'https://{Host}/mva1.htm';
var lcid = '1033';
var courseViewModel = '';

