<?php


namespace TDW\ACiencia\Controller\Association;

use Doctrine\ORM;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Http\Response;
use TDW\ACiencia\Controller\Element\ElementRelationsBaseController;
use TDW\ACiencia\Controller\Entity\EntityQueryController;
use TDW\ACiencia\Entity\Association;
use TDW\ACiencia\Factory\AssociationFactory;

final class AssociationRelationsController extends ElementRelationsBaseController
{
    public static function getEntityClassName(): string
    {
        return AssociationQueryController::getEntityClassName();
    }

    protected static function getFactoryClassName(): string
    {
        return AssociationFactory::class;
    }

    public static function getEntitiesTag(): string
    {
        return AssociationQueryController::getEntitiesTag();
    }

    public static function getEntityIdName(): string
    {
        return AssociationQueryController::getEntityIdName();
    }


    public function getEntities(Request $request, Response $response, array $args): Response
    {
        /** @var Association|null $association */
        $association = $this->entityManager
            ->getRepository(AssociationQueryController::getEntityClassName())
            ->find($args[AssociationQueryController::getEntityIdName()]);

        $entities = $association?->getEntities() ?? [];

        return $this->getElements($response, $association, EntityQueryController::getEntitiesTag(), $entities);
    }

    public function operationEntity(Request $request, Response $response, array $args): Response
    {
        return $this->operationRelatedElements(
            $request,
          $response,
            $args,
            EntityQueryController::getEntityClassName()
        );
    }   
}