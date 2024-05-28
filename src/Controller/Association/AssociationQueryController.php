<?php

namespace TDW\ACiencia\Controller\Association;

use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Http\Response;
use TDW\ACiencia\Controller\Element\ElementBaseQueryController;
use TDW\ACiencia\Entity\Association;


class AssociationQueryController extends ElementBaseQueryController
{
    public const PATH_ASSOCIATIONS = '/associations';

    public static function getEntitiesTag(): string
    {
        return 'associations';
    }

    public static function getEntityClassName(): string
    {
        return Association::class;
    }

    public static function getEntityIdName(): string
    {
        return 'associationId';
    }

    public function getAssociationname(Request $request, Response $response, array $args): Response
    {
        return $this->getElementByName($response, $args['associationname']);
    }
}