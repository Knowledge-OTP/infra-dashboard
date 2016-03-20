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
                // @todo: how we pass the override css class??
                //this.overrideCssClass = popupData.overrideCssClass;

                $mdDialog.show({
                    locals: {
                        svgIcon: popupData.svgIcon,
                        innerTemplateUrl: popupData.innerTemplateUrl
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


