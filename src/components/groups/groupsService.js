(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.groups').provider('GroupsService', [
        function () {

            var StorageSrvName;

            this.setStorageServiceName = function (storageServiceName) {
                StorageSrvName = storageServiceName;
            };

            this.$get = ['$injector', function($injector) {

                var GroupsService = {};
                function _getStorage(){
                    return $injector.get(StorageSrvName);
                }

                function _getGroupPath(){
                    return _getStorage().variables.appUserSpacePath + '/groups';
                }

                GroupsService.createGroup = function (groupName) {
                    var self = this;
                    return _getStorage().get(_getGroupPath()).then(function (groups) {
                        var groupId = Object.keys(groups).length + 1;
                        groups[groupId] = {
                            name: groupName
                        };

                        return self.setGroups(groups);
                    });
                };

                GroupsService.addStudentsToGroup = function (groupId, studentsArr) {
                    var self = this;
                    return this.getGroup(groupId).then(function (group) {
                        if (!angular.isArray(group.student)) {
                            group.student = [];
                        }

                        angular.forEach(studentsArr, function (studentId) {
                            group.student.push(studentId);
                        });

                        return self.setGroup(groupId, group);
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

                GroupsService.getAllGroups = function () {
                    return _getStorage().get(_getGroupPath());
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

                return GroupsService;

            }];
        }
    ]);
})(angular);

