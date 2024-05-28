<?php


use Slim\App;
use TDW\ACiencia\Controller\Association\{ AssociationCommandController, AssociationQueryController, AssociationRelationsController };
use TDW\ACiencia\Middleware\JwtMiddleware;

/**
 * ############################################################
 * routes /api/v1/associations
 * ############################################################
 * @param App $app
 */
return function (App $app) {

    $REGEX_ASSOCIATION_ID = '/{associationId:[0-9]+}';
    $REGEX_ELEMENT_ID = '/{elementId:[0-9]+}';
    $REGEX_ASSOCIATION_NAME = '[a-zA-Z0-9()áéíóúÁÉÍÓÚñÑ %$\.+-]+';
    $UNLIMITED_OPTIONAL_PARAMETERS = '/[{params:.*}]';

    // CGET|HEAD: Returns all associations
    $app->map(
        [ 'GET', 'HEAD' ],
        $_ENV['RUTA_API'] . AssociationQueryController::PATH_ASSOCIATIONS,
        AssociationQueryController::class . ':cget'
    )->setName('readAssociations');
    //    ->add(JwtMiddleware::class);

    // GET|HEAD: Returns a association based on a single ID
    $app->map(
        [ 'GET', 'HEAD' ],
        $_ENV['RUTA_API'] . AssociationQueryController::PATH_ASSOCIATIONS . $REGEX_ASSOCIATION_ID,
        AssociationQueryController::class . ':get'
    )->setName('readAssociation');
    //    ->add(JwtMiddleware::class);

    // GET: Returns status code 204 if associationname exists
    $app->get(
        $_ENV['RUTA_API'] . AssociationQueryController::PATH_ASSOCIATIONS . '/associationname/{associationname:' . $REGEX_ASSOCIATION_NAME . '}',
        AssociationQueryController::class . ':getAssociationname'
    )->setName('existsAssociation');

    // OPTIONS: Provides the list of HTTP supported methods
    $app->options(
        $_ENV['RUTA_API'] . AssociationQueryController::PATH_ASSOCIATIONS . '[' . $REGEX_ASSOCIATION_ID . ']',
        AssociationQueryController::class . ':options'
    )->setName('optionsAssociation');

    // DELETE: Deletes a association
    $app->delete(
        $_ENV['RUTA_API'] . AssociationCommandController::PATH_ASSOCIATIONS . $REGEX_ASSOCIATION_ID,
        AssociationCommandController::class . ':delete'
    )->setName('deleteAssociation')
        ->add(JwtMiddleware::class);

    // POST: Creates a new association
    $app->post(
        $_ENV['RUTA_API'] . AssociationCommandController::PATH_ASSOCIATIONS,
        AssociationCommandController::class . ':post'
    )->setName('createAssociation')
        ->add(JwtMiddleware::class);

    // PUT: Updates a association
    $app->put(
        $_ENV['RUTA_API'] . AssociationCommandController::PATH_ASSOCIATIONS . $REGEX_ASSOCIATION_ID,
        AssociationCommandController::class . ':put'
    )->setName('updateAssociation')
        ->add(JwtMiddleware::class);

    // RELATIONSHIPS
    // OPTIONS /associations/{associationId}[/{params:.*}]
    $app->options(
        $_ENV['RUTA_API'] . AssociationQueryController::PATH_ASSOCIATIONS . $REGEX_ASSOCIATION_ID . $UNLIMITED_OPTIONAL_PARAMETERS,
        AssociationRelationsController::class . ':optionsElements'
    )->setName('optionsAssociationsRelationships');

    // GET /associations/{associationId}/entities
    $app->get(
        $_ENV['RUTA_API'] . AssociationQueryController::PATH_ASSOCIATIONS . $REGEX_ASSOCIATION_ID . '/entities',
        AssociationRelationsController::class . ':getEntities'
    )->setName('readAssociationEntities');
    //    ->add(JwtMiddleware::class);

    // PUT /associations/{associationId}/entities/add/{elementId}
    $app->put(
        $_ENV['RUTA_API'] . AssociationCommandController::PATH_ASSOCIATIONS . $REGEX_ASSOCIATION_ID . '/entities/add' . $REGEX_ELEMENT_ID,
        AssociationRelationsController::class . ':operationEntity'
    )->setName('tdw_associations_add_entity')
        ->add(JwtMiddleware::class);

    // PUT /associations/{associationId}/entities/rem/{elementId}
    $app->put(
        $_ENV['RUTA_API'] . AssociationCommandController::PATH_ASSOCIATIONS . $REGEX_ASSOCIATION_ID . '/entities/rem' . $REGEX_ELEMENT_ID,
        AssociationRelationsController::class . ':operationEntity'
    )->setName('tdw_associations_rem_entity')
        ->add(JwtMiddleware::class);
};