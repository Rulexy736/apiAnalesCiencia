<?php

/**
 * src/Entity/Association.php
 *
 * @license https://opensource.org/licenses/MIT MIT License
 * @link    https://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

namespace TDW\ACiencia\Entity;

use DateTime;
use Doctrine\Common\Collections\{ ArrayCollection, Collection };
use Doctrine\ORM\Mapping as ORM;
use JetBrains\PhpStorm\ArrayShape;

#[ORM\Entity, ORM\Table(name: "association")]
#[ORM\UniqueConstraint(name: "Association_name_uindex", columns: [ "name" ])]

class Association extends Element 
{
    #[ORM\ManyToMany(targetEntity: Entity::class, inversedBy: "associations")]
    #[ORM\JoinTable(name: "entity_contributes_association")]
    #[ORM\JoinColumn(name: "association_id", referencedColumnName: "id")]
    #[ORM\InverseJoinColumn(name: "entity_id", referencedColumnName: "id")]
    protected Collection $entities;

      /**
     * Product constructor.
     *
     * @param non-empty-string $name
     * @param DateTime|null $birthDate
     * @param DateTime|null $deathDate
     * @param string|null $imageUrl
     * @param string|null $wikiUrl
     */
    public function __construct(
        string $name,
        ?DateTime $birthDate = null,
        ?DateTime $deathDate = null,
        ?string $imageUrl = null,
        ?string $wikiUrl = null
    ) {
        parent::__construct($name, $birthDate, $deathDate, $imageUrl, $wikiUrl);
        $this->entities = new ArrayCollection();
    }

        // Entities


    public function getEntities(): array
    {
        return $this->entities->getValues();
    }

    public function containsEntity(Entity $entity): bool
    {
        return $this->entities->contains($entity);
    }

    public function addEntity(Entity $entity): void
    {
        if (!$this->containsEntity($entity)) {
            $this->entities->add($entity);
        }
    }

    public function removeEntity(Entity $entity): bool
    {
        return $this->entities->removeElement($entity);
    }

    public function __toString(): string
    {
        return sprintf(
            '%s entities=%s)]',
            parent::__toString(),
            $this->getCodesTxt($this->getEntities())
        );
    }

    #[ArrayShape(['association' => "array|mixed"])]
    public function jsonSerialize(): mixed
    {
        $data = parent::jsonSerialize();
        $data['entities'] = $this->getEntities() ? $this->getCodes($this->getEntities()) : null;

        return ['association' => $data];
    }
}
