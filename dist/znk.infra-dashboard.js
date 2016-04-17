(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard', [
        'znk.infra-dashboard.groups',
        'znk.infra-dashboard.modal',
        'znk.infra-dashboard.utils'
    ]);
})(angular);

(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.utils', []);
})(angular);

(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.groups', []);
})(angular);

(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.modal', []);
})(angular);

(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.utils').filter('cutString', [function () {

        return function (str, length) {

            if (!str) {
                return '';
            }
            if (str.length < length) {
                return str;
            }

            var words = str.split(' ');
            var newStr = '';

            for (var i = 0; i < words.length; i++) {
                if (newStr.length + words[i].length <= length) {
                    newStr = newStr + words[i] + ' ';
                } else {
                    break;
                }
            }

            return newStr + '...';
        };
    }]);
})(angular);

(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.groups').provider('GroupsService', [
        function () {

            var StorageSrvName;
            var AuthServiceName;

            this.setHelpersServiceName = function (storageServiceName, authServiceName) {
                StorageSrvName = storageServiceName;
                AuthServiceName = authServiceName;
            };

            this.$get = ['$injector', '$q', 'ENV', '$timeout', function($injector, $q, ENV) {

                var GroupsService = {};
                var defaultGroupName = 'assorted';
                var allGroups = {};


                function _getStorage(){
                    return $injector.get(StorageSrvName);
                }

                function _authService(){
                    return $injector.get(AuthServiceName);
                }

                function _getGroupPath(){
                    return _getStorage().variables.appUserSpacePath + '/groups';
                }

                GroupsService.createGroup = function (groupName) {
                    var self = this;
                    return _getStorage().get(_getGroupPath()).then(function (groups) {
                        var groupId = Object.keys(groups).length + 1;
                        groups[groupId] = {
                            name: groupName,
                            groupKey: groupId
                        };

                        return self.setGroups(groups);
                    });
                };

                GroupsService.updateStudent = function (groupKey, studentId, newStudent) {
                    var self = this;
                    return self.getGroup(groupKey).then(function (studentGroup) {
                        if (!newStudent) {
                            delete studentGroup.students[studentId];
                        } else {
                            studentGroup.students[studentId] = newStudent;
                        }

                        return self.setGroup(groupKey, studentGroup).then(function () {
                            return self.getAllGroups();
                        });
                    });
                };

                GroupsService.getAllGroups = function () {
                    return $q.when(allGroups);
                };

                GroupsService.moveToGroup = function (fromGroupKey, toGroupKey, studentIdsArr) {
                    var self = this;
                    return self.getGroup(fromGroupKey).then(function (fromGroup) {
                        var movedStudents = {};

                        angular.forEach(studentIdsArr, function (studentId) {
                            movedStudents[studentId] = fromGroup.students[studentId];
                            delete fromGroup.students[studentId];
                        });

                        return self.setGroup(fromGroupKey, fromGroup).then(function () {
                            return self.getGroup(toGroupKey).then(function (toGroup) {
                                if (!toGroup.students) {
                                    toGroup.students = {};
                                }
                                angular.forEach(studentIdsArr, function (studentId) {
                                    toGroup.students[studentId] = movedStudents[studentId];
                                });

                                return self.setGroup(toGroupKey, toGroup).then(function () {
                                    return self.getAllGroups();
                                });
                            });
                        });
                    });
                };

                GroupsService.setGroups = function (newGroups) {
                    return _getStorage().set(_getGroupPath(), newGroups);
                };

                GroupsService.setGroup = function (id, newGroup) {
                    var self = this;
                    return this.getAllGroups().then(function (groups) {
                        groups[id] = newGroup;
                        return self.setGroups(groups);
                    });
                };

                GroupsService.getGroup = function (id) {
                    return this.getAllGroups().then(function (groups) {
                        return groups[id];
                    });
                };

                GroupsService.deleteGroup = function (groupKey) {
                    return GroupsService.getAllGroups().then(function (groups) {
                        var students = angular.copy(groups[groupKey].students);
                        delete groups[groupKey];

                        angular.forEach(students, function (student, key) {
                            groups[defaultGroupName].students[key] = student;
                        });

                        return GroupsService.setGroups(groups);
                    });
                };

                GroupsService.editGroupName = function (groupKey, newName) {
                    return GroupsService.getGroup(groupKey).then(function (group) {
                        group.name = newName;
                        return GroupsService.setGroup(groupKey, group);
                    });
                };

                function groupListener() {
                    var authData = _authService().getAuth();
                    var fbGroupsPath = _getStorage().variables.appUserSpacePath + '/groups';
                    if (authData && authData.uid) {
                        var groupsFullPath = ENV.fbDataEndPoint + ENV.firebaseAppScopeName + '/' + fbGroupsPath;
                        var groupsPath = groupsFullPath.replace('$$uid', authData.uid);
                        var ref = new Firebase(groupsPath);
                        ref.on('child_added', function (dataSnapshot) {
                            allGroups[dataSnapshot.key()] = dataSnapshot.val();
                        });

                        ref.on('child_removed', function (dataSnapshot) {
                            delete allGroups[dataSnapshot.key()];
                        });
                    }
                }

                groupListener();

                return GroupsService;

            }];
        }
    ]);
})(angular);


'use strict';

(function (angular) {

    function ModalService() {

        var baseTemplateUrl;

        this.setBaseTemplatePath = function(templateUrl) {
            baseTemplateUrl = templateUrl;
        };

        this.$get = ['$mdDialog', function($mdDialog) {
            var ModalService = {};

            ModalService.showBaseModal = function (popupData) {
                $mdDialog.show({
                    locals: {
                        svgIcon: popupData.svgIcon,
                        innerTemplateUrl: popupData.innerTemplateUrl,
                        overrideCssClass: popupData.overrideCssClass,
                        modalData: popupData.modalData,
                        closeModal: function closeModal (){
                            $mdDialog.hide();
                        }
                    },
                    bindToController: true,
                    controller: popupData.controllerName,
                    controllerAs: 'vm',
                    templateUrl: baseTemplateUrl,
                    clickOutsideToClose: true,
                    escapeToClose: true
                });
            };

            return ModalService;
        }];
    }

    angular.module('znk.infra-dashboard.modal').provider('ModalService', ModalService);

})(angular);



angular.module('znk.infra-dashboard').run(['$templateCache', function($templateCache) {

}]);
