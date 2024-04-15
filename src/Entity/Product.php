<?php

/**
 * src/Entity/Product.php
 *
 * @license https://opensource.org/licenses/MIT MIT License
 * @link    https://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

namespace TDW\ACiencia\Entity;

use DateTime;
use Doctrine\Common\Collections\{ ArrayCollection, Collection };
use Doctrine\ORM\Mapping as ORM;
use JetBrains\PhpStorm\ArrayShape;

#[ORM\Entity, ORM\Table(name: "product")]
#[ORM\UniqueConstraint(name: "Product_name_uindex", columns: [ "name" ])]
class Product extends Element
{
    #[ORM\ManyToMany(targetEntity: Person::class, inversedBy: "products")]
    #[ORM\JoinTable(name: "person_contributes_product")]
    #[ORM\JoinColumn(name: "product_id", referencedColumnName: "id")]
    #[ORM\InverseJoinColumn(name: "person_id", referencedColumnName: "id")]
    protected Collection $persons;

    #[ORM\ManyToMany(targetEntity: Entity::class, inversedBy: "products")]
    #[ORM\JoinTable(name: "entity_contributes_product")]
    #[ORM\JoinColumn(name: "product_id", referencedColumnName: "id")]
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
        $this->persons = new ArrayCollection();
        $this->entities = new ArrayCollection();
    }

    // Entities

    /**
     * Gets the entities that participate in the product
     *
     * @return Entity[]
     */
    public function getEntities(): array
    {
        return $this->entities->getValues();
    }

    /**
     * Indicates whether an entity participates in this product
     *
     * @param Entity $entity
     *
     * @return bool
     */
    public function containsEntity(Entity $entity): bool
    {
        return $this->entities->contains($entity);
    }

    /**
     * Add an entity to this product
     *
     * @param Entity $entity
     *
     * @return void
     */
    public function addEntity(Entity $entity): void
    {
        if (!$this->containsEntity($entity)) {
            $this->entities->add($entity);
        }
    }

    /**
     * Removes an entity from this product
     *
     * @param Entity $entity
     *
     * @return bool TRUE if this collection contained the specified element, FALSE otherwise.
     */
    public function removeEntity(Entity $entity): bool
    {
        return $this->entities->removeElement($entity);
    }

    // Persons

    /**
     * Gets people to collaborate on this product
     *
     * @return Person[]
     */
    public function getPersons(): array
    {
        return $this->persons->getValues();
    }

    /**
     * Determine if a person collaborates on this product
     *
     * @param Person $person
     *
     * @return bool
     */
    public function containsPerson(Person $person): bool
    {
        return $this->persons->contains($person);
    }

    /**
     * Add a person to this product
     *
     * @param Person $person
     *
     * @return void
     */
    public function addPerson(Person $person): void
    {
        if (!$this->containsPerson($person)) {
            $this->persons->add($person);
        }
    }

    /**
     * Removes a person from this product
     *
     * @param Person $person
     *
     * @return bool TRUE if this collection contained the specified element, FALSE otherwise.
     */
    public function removePerson(Person $person): bool
    {
        return $this->persons->removeElement($person);
    }

    /**
     * @see \Stringable
     */
    public function __toString(): string
    {
        return sprintf(
            '%s persons=%s, entities=%s)]',
            parent::__toString(),
            $this->getCodesTxt($this->getPersons()),
            $this->getCodesTxt($this->getEntities())
        );
    }

    /**
     * @see \JsonSerializable
     */
    #[ArrayShape(['product' => "array|mixed"])]
    public function jsonSerialize(): mixed
    {
        $data = parent::jsonSerialize();
        $data['persons'] = $this->getPersons() ? $this->getCodes($this->getPersons()) : null;
        $data['entities'] = $this->getEntities() ? $this->getCodes($this->getEntities()) : null;

        return ['product' => $data];
    }
}
