document.addEventListener('DOMContentLoaded', function () {
    var scrollspy = document.querySelectorAll('.scrollspy');
    M.ScrollSpy.init(scrollspy);
});

window.addEventListener("load", function (event) {
    // remove the spinner after all pictures are loaded
    var spinner = document.querySelector('#spinner');
    spinner.style.display = "none";
    
    var body = document.querySelector('body');
    body.classList.remove("spinner-loading");
});

var app = new Vue({
    el: '#app',
    data: {
        addNewPackage: {
            trackingNumber: "",
            packageDescription: ""
        },
        packageState: {
            action: "",
            tab: "",
            index: -1,
            trackingNumber: "",
            packageDescription: "",
            oldPackageDescription: ""
        },
        settings: {
            autoRefresh: undefined,
            refreshInterval: undefined,
            enableNotifications: undefined,
            maxActivePackages: undefined,
            maxArchivePackages: undefined
        },
        mainSpinnerDescription: "",
        activeModal: undefined,     // 4 types: "add", "action", "refresh", "edit"
        allTrackingNumbers: [],
        activePackages: [],
        archivePackages: []
    },
    mounted: function () {
        /**
        * init materialize components and create data needed for the app
        */
        this.$nextTick(function () {
            var thisApp = this;

            // tabs
            MaterializeComponents.tabsInstance = M.Tabs.init(this.$el.querySelector("#tabs"));
            MaterializeComponents.tabsInstance.select("activeView");

            // collapsible
            MaterializeComponents.activeInstance = M.Collapsible.init(this.$el.querySelector("#activeCollapsible"));
            MaterializeComponents.archiveInstance = M.Collapsible.init(this.$el.querySelector("#archiveCollapsible"));

            // floating button
            MaterializeComponents.floatingButtonInstance = M.FloatingActionButton.init(this.$el.querySelector("#floatingButton"));

            // settings view
            MaterializeComponents.refreshIntervalInstance = M.FormSelect.init(this.$el.querySelector("#refreshInterval"));

            // add package modal
            MaterializeComponents.addModal.addModalInstance = M.Modal.init(this.$el.querySelector("#addModal"), {
                onOpenEnd: function () {
                    thisApp.activeModal = "add";
                },
                onCloseStart: function () {
                    thisApp.activeModal = undefined;
                }
            });
            MaterializeComponents.addModal.trackingNumberInput = this.$el.querySelector("#tracking_number");
            MaterializeComponents.addModal.trackingNumberLabel = this.$el.querySelector("#tracking_number_label");
            MaterializeComponents.addModal.packageDescriptionLabel = this.$el.querySelector("#package_description_label");

            // add spinner
            MaterializeComponents.addModal.addSpinner = this.$el.querySelector("#add_spinner");

            // action package modal
            MaterializeComponents.actionModalInstance = M.Modal.init(this.$el.querySelector("#actionModal"), {
                onOpenEnd: function () {
                    thisApp.activeModal = "action";
                },
                onCloseStart: function () {
                    thisApp.activeModal = undefined;
                }
            });

            // refresh packages modal
            MaterializeComponents.refreshModal.refreshModalInstance = M.Modal.init(this.$el.querySelector("#refreshModal"), {
                onOpenEnd: function () {
                    thisApp.activeModal = "refresh";
                },
                onCloseStart: function () {
                    thisApp.activeModal = undefined;
                }
            });

            // refresh spinner
            MaterializeComponents.refreshModal.refreshSpinner = this.$el.querySelector("#refresh_spinner");

            // edit package modal
            MaterializeComponents.editModal.editModalInstance = M.Modal.init(this.$el.querySelector("#editModal"), {
                onOpenEnd: function () {
                    thisApp.activeModal = "edit";
                },
                onCloseStart: function () {
                    thisApp.activeModal = undefined;
                }
            });
            MaterializeComponents.editModal.packageDescriptionInput = this.$el.querySelector("#edit_package_description");
            MaterializeComponents.editModal.packageDescriptionLabel = this.$el.querySelector("#edit_package_description_label");

            // tooltips
            MaterializeComponents.leftTooltipInstances = M.Tooltip.init(this.$el.querySelectorAll(".left-tooltip"));

            // scrollable content
            MaterializeComponents.scrollableContent = this.$el.querySelector("#scrollable-content");

            // main spinner
            MaterializeComponents.mainSpinner = this.$el.querySelector("#main_spinner");

            Common.storageGet([
                Common.storageStrings.storageChange
            ], function (response) {
                // check if there is some proccess in the backround
                var storageChange = response[Common.storageStrings.storageChange];

                if (storageChange !== undefined) {
                    if (storageChange.type === Common.eventsStrings.refreshStart) {
                        thisApp.mainSpinnerDescription = "СЕ ОСВЕЖУВААТ ПРАТКИТЕ";
                    }
                    else if (storageChange.type === Common.eventsStrings.addPackageStart) {
                        thisApp.mainSpinnerDescription = "СЕ ДОДАВА НОВА ПРАТКА";
                    }
                }

                // get all data from background
                thisApp.getAllDataFromBackground();
            });

            // listen for message from browser's background or this popup
            Common.storageListener(function (changes) {
                var storageChange = changes[Common.storageStrings.storageChange];
                var activePackagesChange = changes[Common.storageStrings.activeTrackingNumbers];

                if (storageChange !== undefined && storageChange.newValue.instanceId !== Common.instanceId) {
                    // i need only the newest changes
                    storageChange = storageChange.newValue;

                    if (storageChange.type === Common.eventsStrings.refreshStart) {
                        thisApp.mainSpinnerDescription = "СЕ ОСВЕЖУВААТ ПРАТКИТЕ";
                        // add main spinner
                        MaterializeComponents.mainSpinner.style.display = "block";
                    }
                    else if (storageChange.type === Common.eventsStrings.refreshEnd) {
                        var message = "Освежувањето е прекинато";
                        if (activePackagesChange !== undefined) {
                            // check if the adding was completed
                            message = "Пратките се автоматски освежени";
                        }

                        // refresh popup data if the background data is refreshed in another browser
                        // the main spinner is removed in this method
                        thisApp.getAllDataFromBackground(message);
                    }
                    else if (storageChange.type === Common.eventsStrings.addPackageStart) {
                        thisApp.mainSpinnerDescription = "СЕ ДОДАВА НОВА ПРАТКА";
                        // add main spinner
                        MaterializeComponents.mainSpinner.style.display = "block";
                    }
                    else if (storageChange.type === Common.eventsStrings.addPackageEnd) {
                        var message = "Додавањето е прекинато";
                        if (activePackagesChange !== undefined) {
                            // check if the adding was completed
                            message = "Додадена е нова пратка";
                        }

                        // refresh the popup data if a new package is added in the background
                        // the main spinner is removed in this method
                        thisApp.getAllDataFromBackground(message);
                    }
                }
            });

            // listen for keypress event
            // handles only enter press in modal dialogs  
            document.addEventListener("keydown", function (e) {
                // no modal dialog opened
                if (thisApp.activeModal === undefined) {
                    return;
                }

                // enter is pressed
                if (e.keyCode == 13) {
                    var activeModal = thisApp.activeModal;

                    // reset this property because onCloseStart is slow
                    thisApp.activeModal = undefined;

                    switch (activeModal) {
                        case "add":
                            if (!thisApp.disabledTrackingNumber()) {
                                thisApp.addNewActivePackage();
                            }
                            break;
                        case "action":
                            thisApp.updateFromState();
                            break;
                        case "refresh":
                            thisApp.refreshPackages();
                            break;
                        case "edit":
                            if (!thisApp.disabledPackageDescription()) {
                                thisApp.editPackageFromState();
                            }
                            break;
                    }
                }

            });
        })
    },
    watch: {
        "addNewPackage.trackingNumber": function (newValue) {
            // format the tracking number
            // should contains only upper letters and digits
            var checkValue = newValue.toUpperCase().replace(/\W/g, '');

            if (newValue !== checkValue) {
                this.addNewPackage.trackingNumber = checkValue;
            }
        },
        "settings.autoRefresh": function (newVal, oldVal) {
            if (oldVal !== undefined) {
                Common.changeAutoRefresh(newVal);
            }
        },
        "settings.refreshInterval": function (newVal, oldVal) {
            if (oldVal !== undefined) {
                Common.changeRefreshInterval(newVal);
            }
        },
        "settings.enableNotifications": function (newVal, oldVal) {
            if (oldVal !== undefined) {
                Common.changeEnableNotifications(newVal);
            }
        }
    },
    computed: {
        disableAdding: function () {
            return this.disabledTrackingNumber();
        },
        disableEditing: function () {
            return this.disabledPackageDescription();
        },
        actionModalText: function () {
            return (this.packageState.action === "move") ?
                ((this.packageState.tab === "active") ?
                    "Архивирај" : "Активирај") : "Избриши";
        },
        disableNewActive: function () {
            return this.settings.maxActivePackages === this.activePackages.length;
        },
        disableNewArchive: function () {
            return this.settings.maxArchivePackages === this.archivePackages.length;
        },
        disableRefreshing: function () {
            return this.activePackages.length === 0;
        }
    },
    methods: {


        /**********************
        **   COMMON METHODS  **
        ***********************/

        getAllDataFromBackground: function (backgroundChange) {
            // add main spinner
            MaterializeComponents.mainSpinner.style.display = "block";

            // scroll to the top of the view
            MaterializeComponents.scrollableContent.scrollTop = 0;

            // close the active collapsibles
            for (var i = 0; i < this.activePackages.length; i++) {
                MaterializeComponents.activeInstance.close(i);
            }

            var thisApp = this;

            // get all data from the storage
            Common.getAllData(function (response) {
                // clear the lists with tracking numbers
                thisApp.allTrackingNumbers = [];
                thisApp.activePackages = [];
                thisApp.archivePackages = [];

                // get all settings properties
                thisApp.settings.autoRefresh = response[Common.storageStrings.autoRefresh];
                thisApp.settings.refreshInterval = response[Common.storageStrings.refreshInterval];
                thisApp.settings.enableNotifications = response[Common.storageStrings.enableNotifications];
                thisApp.settings.maxActivePackages = response[Common.storageStrings.maxActivePackages];
                thisApp.settings.maxArchivePackages = response[Common.storageStrings.maxArchivePackages];

                // all packages with data
                var allPackagesWithData = response[Common.storageStrings.trackingNumbers];

                // get all active packages
                var activeTrackingNumbers = response[Common.storageStrings.activeTrackingNumbers];
                for (var a = 0; a < activeTrackingNumbers.length; a++) {
                    var formatedPackageData = Common.formatPackageData(allPackagesWithData[activeTrackingNumbers[a]]);
                    thisApp.activePackages.push(formatedPackageData);
                    thisApp.allTrackingNumbers.push(activeTrackingNumbers[a]);
                }

                // get all archived packages
                var archiveTrackingNumbers = response[Common.storageStrings.archiveTrackingNumbers];
                for (var a = 0; a < archiveTrackingNumbers.length; a++) {
                    var formatedPackageData = Common.formatPackageData(allPackagesWithData[archiveTrackingNumbers[a]]);
                    thisApp.archivePackages.push(formatedPackageData);
                    thisApp.allTrackingNumbers.push(archiveTrackingNumbers[a]);
                }

                // update the refresh interval select manually
                thisApp.updateRefreshIntervalSelect();

                // check if there is some proccess in the backround
                var storageChange = response[Common.storageStrings.storageChange];

                // remove the main spiner after loading the whole info
                if (storageChange !== undefined &&
                    (storageChange.type === Common.eventsStrings.refreshStart ||
                    storageChange.type === Common.eventsStrings.addPackageStart)) {
                    var lastChange = Common.dateDiff(storageChange.time, Common.dateNowJSON());

                    // if there is an active process in the background, check if it happened a long time ago
                    if (lastChange > Common.maxRequestTime + Common.requestExtraTime) {
                        MaterializeComponents.mainSpinner.style.display = "none";
                    }
                }
                else {
                    // if there is no active process in the background, remove the main spinner
                    MaterializeComponents.mainSpinner.style.display = "none";
                }

                // display a toast if this method was activated because of a background change
                if (backgroundChange !== undefined) {
                    M.toast({ html: backgroundChange });
                }
            });
        },
        updateRefreshIntervalSelect: function () {
            // update this select manually (materialize doesn't handle vue property change)
            var nOptions = MaterializeComponents.refreshIntervalInstance.$selectOptions.length;

            for (var o = 0; o < nOptions; o++) {
                if (MaterializeComponents.refreshIntervalInstance.$selectOptions[o].value == this.settings.refreshInterval) {
                    MaterializeComponents.refreshIntervalInstance.$selectOptions[o].selected = true;
                } else {
                    MaterializeComponents.refreshIntervalInstance.$selectOptions[o].selected = false;
                }
            }

            MaterializeComponents.refreshIntervalInstance._setValueToInput();
        },
        updateFromState: function () {
            if (this.packageState.action === "move") {
                this.movePackageFromState();
            } else {
                this.deletePackageFromState();
            }
        },
        removeNotifications: function (index) {
            var thisApp = this;

            if (thisApp.activePackages[index].notifications > 0) {
                Common.removeNotifications(thisApp.activePackages[index].trackingNumber, function () {
                    thisApp.activePackages[index].notifications = 0;
                });
            }
        },
        disabledTrackingNumber: function () {
            // disable add button if the tracking number contains less than 8 chars
            // or if that tracking number exist in the active or archive collapsible
            return this.addNewPackage.trackingNumber.length < 8 ||
                this.allTrackingNumbers.indexOf(this.addNewPackage.trackingNumber) !== -1;
        },
        disabledPackageDescription: function () {
            // disable edit button if the package description is same as the old package description
            return this.packageState.packageDescription === this.packageState.oldPackageDescription;
        },


        /**********************
        **   DELETE PACKAGE  **
        ***********************/


        deletePackageFromState: function () {
            var thisApp = this;

            if (thisApp.packageState.tab === "active") {
                Common.deleteActivePackage(
                    thisApp.packageState.trackingNumber,
                    function () {
                        thisApp.deleteActivePackage();
                        thisApp.afterDeleting();
                    }
                );
            } else {
                Common.deleteArchivePackage(
                    thisApp.packageState.trackingNumber,
                    function () {
                        thisApp.deleteArchivePackage();
                        thisApp.afterDeleting();
                    }
                );
            }
        },
        afterDeleting: function () {
            var allTrackingNumbersIndex = this.allTrackingNumbers.indexOf(this.packageState.trackingNumber);
            this.allTrackingNumbers.splice(allTrackingNumbersIndex, 1);

            // close modal
            MaterializeComponents.actionModalInstance.close();
        },
        deleteActivePackage: function () {
            var activeIndex = this.packageState.index;
            MaterializeComponents.activeInstance.options.outDuration = 0;
            MaterializeComponents.activeInstance.close(activeIndex);
            MaterializeComponents.activeInstance.options.outDuration = 300;
            this.activePackages.splice(activeIndex, 1);
        },
        saveActiveStateDeleteModal: function (index) {
            // save which element should be deleted
            this.packageState.action = "delete";
            this.packageState.tab = "active";
            this.packageState.index = index;
            this.packageState.trackingNumber = this.activePackages[index].trackingNumber;

            // open delete modal
            MaterializeComponents.actionModalInstance.open();
        },
        deleteArchivePackage: function () {
            var archiveIndex = this.packageState.index;
            MaterializeComponents.archiveInstance.options.outDuration = 0;
            MaterializeComponents.archiveInstance.close(archiveIndex);
            MaterializeComponents.archiveInstance.options.outDuration = 300;
            this.archivePackages.splice(archiveIndex, 1);
        },
        saveArchiveStateDeleteModal: function (index) {
            // save which element should be deleted
            this.packageState.action = "delete";
            this.packageState.tab = "archive";
            this.packageState.index = index;
            this.packageState.trackingNumber = this.archivePackages[index].trackingNumber;

            // open delete modal
            MaterializeComponents.actionModalInstance.open();
        },


        /********************
        **   MOVE PACKAGE  **
        *********************/


        movePackageFromState: function () {
            var thisApp = this;

            if (thisApp.packageState.tab === "active") {
                Common.moveActiveToArchive(
                    thisApp.packageState.trackingNumber,
                    function () {
                        thisApp.moveActivePackage();

                        // close modal
                        MaterializeComponents.actionModalInstance.close();
                    }
                );
            } else {
                Common.moveArchiveToActive(
                    thisApp.packageState.trackingNumber,
                    function () {
                        thisApp.moveArchivePackage();

                        // close modal
                        MaterializeComponents.actionModalInstance.close();
                    }
                );
            }
        },
        moveActivePackage: function () {
            var activeIndex = this.packageState.index;
            this.archivePackages.push(this.activePackages[activeIndex]);
            this.deleteActivePackage();
        },
        saveActiveStateMoveModal: function (index) {
            // save which element should be moved
            this.packageState.action = "move";
            this.packageState.tab = "active";
            this.packageState.index = index;
            this.packageState.trackingNumber = this.activePackages[index].trackingNumber;

            // open delete modal
            MaterializeComponents.actionModalInstance.open();
        },
        moveArchivePackage: function () {
            var archiveIndex = this.packageState.index;
            this.activePackages.push(this.archivePackages[archiveIndex]);
            this.deleteArchivePackage();
        },
        saveArchiveStateMoveModal: function (index) {
            // save which element should be moved
            this.packageState.action = "move";
            this.packageState.tab = "archive";
            this.packageState.index = index;
            this.packageState.trackingNumber = this.archivePackages[index].trackingNumber;

            // open delete modal
            MaterializeComponents.actionModalInstance.open();
        },


        /*********************
        **  ADD NEW PACKAGE **
        **********************/


        openAddModal: function () {
            // update input fields
            this.addNewPackage.trackingNumber = "";
            this.addNewPackage.packageDescription = "";

            MaterializeComponents.addModal.trackingNumberLabel.classList.remove("active");
            MaterializeComponents.addModal.packageDescriptionLabel.classList.remove("active");

            // remove add spinner
            MaterializeComponents.addModal.addSpinner.style.display = "none";

            // open modal
            MaterializeComponents.addModal.addModalInstance.open();

            // focus on first field
            MaterializeComponents.addModal.trackingNumberInput.focus();
        },
        addNewActivePackage: function () {
            // can not close the add modal by clicking outside when adding a package
            MaterializeComponents.addModal.addModalInstance.options.dismissible = false;

            // add spinner
            MaterializeComponents.addModal.addSpinner.style.display = "block";

            var thisApp = this;

            // add the new tracking number in the storage and in the UI
            Common.addNewPackage(
                thisApp.addNewPackage.trackingNumber,
                thisApp.addNewPackage.packageDescription,
                false,
                function (response) {
                    // add the formated data in the UI
                    var formatedResponse = Common.formatPackageData(response);
                    thisApp.activePackages.push(formatedResponse);

                    // push this tracking number in the list with all tracking numbers
                    thisApp.allTrackingNumbers.push(thisApp.addNewPackage.trackingNumber);

                    // open the last added package and scroll to the bottom
                    var latestPackage = thisApp.activePackages.length - 1;
                    MaterializeComponents.addModal.addModalInstance.options.onCloseEnd = function () {
                        MaterializeComponents.activeInstance.options.onOpenEnd = function () {
                            // scroll to the bottom (user should see the newest results)
                            MaterializeComponents.scrollableContent.scrollTop =
                                MaterializeComponents.scrollableContent.scrollHeight;

                            // revert onOpenEnd function
                            MaterializeComponents.activeInstance.options.onOpenEnd = undefined;
                        };
                        MaterializeComponents.activeInstance.open(latestPackage);

                        // revert onCloseEnd function
                        MaterializeComponents.addModal.addModalInstance.options.onCloseEnd = undefined;
                    };

                    // close modal after getting the results from the api and writting them in storage
                    MaterializeComponents.addModal.addModalInstance.close();

                    // restore dismissible after the package is added
                    MaterializeComponents.addModal.addModalInstance.options.dismissible = true;
                });
        },


        /******************************
        **  REFRESH ACTIVE PACKAGES  **
        ******************************/


        openRefreshModal: function () {
            // remove refresh spinner
            MaterializeComponents.refreshModal.refreshSpinner.style.display = "none";

            // open modal
            MaterializeComponents.refreshModal.refreshModalInstance.open();
        },
        refreshPackages: function () {
            // can not close the add modal by clicking outside when refreshing active packages
            MaterializeComponents.refreshModal.refreshModalInstance.options.dismissible = false;

            // add refresh spinner
            MaterializeComponents.refreshModal.refreshSpinner.style.display = "block";

            // scroll to the top of the view
            MaterializeComponents.scrollableContent.scrollTop = 0;

            // close the active collapsibles
            for (var i = 0; i < this.activePackages.length; i++) {
                MaterializeComponents.activeInstance.close(i);
            }

            var thisApp = this;

            // refresh active tracking numbers
            Common.refreshActiveTrackingNumbers(function (response) {

                // get all active tracking numbers
                var activeTrackingNumbers = response[Common.storageStrings.activeTrackingNumbers];

                // clear the old list with active packages
                thisApp.activePackages = [];

                // format the results and update the UI
                for (var p = 0; p < activeTrackingNumbers.length; p++) {
                    var packageData = response[Common.storageStrings.trackingNumbers + activeTrackingNumbers[p]];
                    var formatedPackageData = Common.formatPackageData(packageData);
                    thisApp.activePackages.push(formatedPackageData);
                }

                // close the refresh modal in the end
                MaterializeComponents.refreshModal.refreshModalInstance.close();

                // restore dismissible after the packages are refreshed
                MaterializeComponents.refreshModal.refreshModalInstance.options.dismissible = true;
            });
        },


        /********************
        **   EDIT PACKAGE  **
        *********************/


        editPackageFromState: function () {
            var thisApp = this;

            Common.changePackageDescription(
                thisApp.packageState.trackingNumber,
                thisApp.packageState.packageDescription,
                function () {
                    if (thisApp.packageState.tab === "active") {
                        thisApp.editActivePackage();
                    } else {
                        thisApp.editArchivePackage();
                    }

                    // close modal
                    MaterializeComponents.editModal.editModalInstance.close();
                }
            );
        },
        editActivePackage: function () {
            this.activePackages[this.packageState.index].packageDescription = this.packageState.packageDescription;
        },
        saveActiveStateEditModal: function (index) {
            // save which element should be edited
            this.packageState.action = "edit";
            this.packageState.tab = "active";
            this.packageState.index = index;
            this.packageState.trackingNumber = this.activePackages[index].trackingNumber;
            this.packageState.packageDescription = this.activePackages[index].packageDescription;
            this.packageState.oldPackageDescription = this.activePackages[index].packageDescription;

            this.updateFocusAndOpenEditModal();
        },
        editArchivePackage: function () {
            this.archivePackages[this.packageState.index].packageDescription = this.packageState.packageDescription;
        },
        saveArchiveStateEditModal: function (index) {
            // save which element should be edited
            this.packageState.action = "edit";
            this.packageState.tab = "archive";
            this.packageState.index = index;
            this.packageState.trackingNumber = this.archivePackages[index].trackingNumber;
            this.packageState.packageDescription = this.archivePackages[index].packageDescription;
            this.packageState.oldPackageDescription = this.archivePackages[index].packageDescription;

            this.updateFocusAndOpenEditModal();
        },
        updateFocusAndOpenEditModal: function () {
            // update input field label
            MaterializeComponents.editModal.packageDescriptionLabel.classList.remove("active");
            if (this.packageState.packageDescription.length > 0) {
                MaterializeComponents.editModal.packageDescriptionLabel.classList.add("active");
            }

            // open delete modal
            MaterializeComponents.editModal.editModalInstance.open();

            // focus the input field
            MaterializeComponents.editModal.packageDescriptionInput.focus();
        }
    }
});