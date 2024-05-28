<?php

namespace TDW\ACiencia\Controller\Association;

use TDW\ACiencia\Controller\Element\ElementBaseCommandController;
use TDW\ACiencia\Entity\Association;
use TDW\ACiencia\Factory\AssociationFactory;

class AssociationCommandController extends ElementBaseCommandController 
{
public const PATH_ASSOCIATIONS = '/associations';

public static function getEntityClassName(): string
    {
        return Association::class;
    }

    protected static function getFactoryClassName(): string
    {
        return AssociationFactory::class;
    }

    public static function getEntityIdName(): string
    {
        return 'associationId';
    }
}
