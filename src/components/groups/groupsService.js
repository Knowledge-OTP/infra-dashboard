(function (angular) {
    'use strict';

    angular.module('znk.infra-dashboard.groups').service('GroupsService', [
        'InfraConfigSrv',
        function (InfraConfigSrv) {

            var StorageSrv = InfraConfigSrv.getStorageService();
            var GROUPS_PATH = StorageSrv.variables.appUserSpacePath + '/groups';

            this.createGroup = function (groupName) {
                var self = this;
                return StorageSrv.get(GROUPS_PATH).then(function (groups) {
                    var groupId = Object.keys(groups).length + 1;
                    groups[groupId] = {
                        name: groupName
                    };

                    return self.setGroups(groups);
                });
            };

            this.addStudentsToGroup = function (groupId, studentsArr) {
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

            this.setGroups = function (newGroups) {
                return StorageSrv.set(GROUPS_PATH, newGroups);
            };

            this.setGroup = function (id, newGroup) {
                var self = this;
                return this.getAllGroups().then(function (groups) {
                    groups[id] = newGroup;
                    return self.setGroups(groups);
                });
            };

            this.getGroup = function (id) {
                return this.getAllGroups().then(function (groups) {
                    return groups[id];
                });
            };

            this.getAllGroups = function () {
                return StorageSrv.get(GROUPS_PATH);
            };

            this.moveToGroup = function (fromGroupKey, toGroupKey, studentId) {
                var self = this;
                return self.getGroup(fromGroupKey).then(function (fromGroup) {
                    var studentObj = fromGroup.students[studentId];
                    delete fromGroup.students[studentId];

                    return self.setGroup(fromGroupKey, fromGroup).then(function () {
                        return self.getGroup(toGroupKey).then(function (toGroup) {
                            if (!toGroup.students) {
                                toGroup.students = {};
                            }

                            toGroup.students[studentId] = studentObj;
                            return self.setGroup(toGroupKey, toGroup).then(function () {
                                return self.getAllGroups();
                            });
                        });
                    });
                });
            };

            this.updateStudent = function (groupKey, newStuednt) {
                var self = this;
                return self.getGroup(groupKey).then(function (studentGroup) {
                    studentGroup.students.receiverUid = newStuednt;
                    return self.setGroup(groupKey, studentGroup).then(function () {
                        return self.getAllGroups();
                    });
                });
            };
        }
    ]);
})(angular);

