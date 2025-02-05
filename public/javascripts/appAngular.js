angular.module('appTareas', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('alta', {
                url: '/alta',
                templateUrl: 'views/alta.html',
                controller: 'ctrlAlta'
            })
            .state('editar', {
                url: '/editar',
                templateUrl: 'views/editar.html',
                controller: 'ctrlEditar'
            });

        $urlRouterProvider.otherwise('alta');
    })
    .factory('comun', function($http) {
        var comun = {};

        comun.tareas = [];
        comun.tarea = {};

        /*** Métodos remotos ***/
        comun.getAll = function(){
            return $http.get('/tareas')
            .then(function(response){
                angular.copy(response.data, comun.tareas);
                return comun.tareas;
            })
            .catch(function(error){
                console.error("Error al obtener tareas:", error);
            });
        };

        comun.add = function(tarea){
            return $http.post('/tarea', tarea)
            .then(function(response){
                comun.tareas.push(response.data);
                return response.data;
            })
            .catch(function(error){
                console.error("Error al agregar tarea:", error);
            });
        };

        comun.update = function(tarea){
            return $http.put('/tarea/' + tarea._id, tarea)
            .then(function(response){
                var indice = comun.tareas.indexOf(tarea);
                comun.tareas[indice] = response.data;
                return response.data;
            })
            .catch(function(error){
                console.error("Error al actualizar tarea:", error);
            });
        };

        comun.delete = function(tarea){
            return $http.delete('/tarea/' + tarea._id)
            .then(function(){
                var indice = comun.tareas.indexOf(tarea);
                comun.tareas.splice(indice, 1);
            })
            .catch(function(error){
                console.error("Error al eliminar tarea:", error);
            });
        };

        return comun;
    })
    .controller('ctrlAlta', function($scope, $state, comun) {
        $scope.tarea = {};
        $scope.prioridades = ['Baja', 'Normal', 'Alta'];

        // ✅ Esperar a que getAll() termine antes de asignar tareas
        comun.getAll().then(function(tareas) {
            $scope.tareas = tareas;
        });

        $scope.agregar = function() {
            if (!$scope.tarea.nombre || !$scope.tarea.prioridad) {
                alert("Completa todos los campos antes de agregar la tarea.");
                return;
            }

            comun.add({
                nombre: $scope.tarea.nombre,
                prioridad: parseInt($scope.tarea.prioridad)
            }).then(function(nuevaTarea) {
                $scope.tareas.push(nuevaTarea); // Agrega la tarea a la lista en la vista
                $scope.tarea = {}; // Limpia el formulario
            });
        };

        $scope.masPrioridad = function(tarea) {
            tarea.prioridad += 1;
        };

        $scope.menosPrioridad = function(tarea) {
            tarea.prioridad -= 1;
        };

        $scope.eliminar = function(tarea) {
            comun.delete(tarea).then(function() {
                // Se actualiza automáticamente por la eliminación en comun.delete()
            });
        };

        $scope.procesaObjeto = function(tarea) {
            comun.tarea = tarea;
            $state.go('editar');
        };

    })
    .controller('ctrlEditar', function($scope, $state, comun) {
        $scope.tarea = comun.tarea;

        $scope.actualizar = function() {
            comun.update($scope.tarea).then(function() {
                $state.go('alta');
            });
        };

        $scope.eliminar = function(){
            comun.delete($scope.tarea).then(function() {
                $state.go('alta');
            });
        };
    });
