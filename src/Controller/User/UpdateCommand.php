<?php

/**
 * src/Controller/User/UpdateCommand.php
 *
 * @license https://opensource.org/licenses/MIT MIT License
 * @link    https://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

namespace TDW\ACiencia\Controller\User;

use Doctrine\ORM;
use Fig\Http\Message\StatusCodeInterface as StatusCode;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Http\Response;
use TDW\ACiencia\Controller\TraitController;
use TDW\ACiencia\Entity\User;
use TDW\ACiencia\Utility\Error;
use Throwable;

/**
 * Class UpdateCommand
 */
class UpdateCommand
{
    use TraitController;

    /** @var string ruta api gestión usuarios  */
    public const PATH_USERS = '/users';

    // constructor receives container instance
    public function __construct(protected ORM\EntityManager $entityManager)
    {
    }

    /**
     * PUT /api/v1/users/{userId}
     *
     * Summary: Updates a user
     * - A READER user can only modify their own properties
     * - A READER user cannot modify his ROLE
     *
     * @param Request $request
     * @param Response $response
     * @param array<non-empty-string,non-empty-string> $args
     *
     * @return Response
     * @throws ORM\Exception\ORMException
     */
    public function __invoke(Request $request, Response $response, array $args): Response
    {
        assert($request->getMethod() === 'PUT');
        assert($args['userId'] != 0);
        $isWriter = $this->checkWriterScope($request);
        $userRequestId = $this->getUserId($request);
        if (!$isWriter && intval($args['userId']) !== $userRequestId) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND); // 403 => 404 por seguridad
        }

        /** @var array<string,string> $req_data */
        $req_data = $request->getParsedBody() ?? [];
        /** @var User|null $userToModify */
        $userToModify = $this->entityManager->getRepository(User::class)->find($args['userId']);

        if (!$userToModify instanceof User) {    // 404
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        // Optimistic Locking (strong validation)
        $etag = md5(json_encode($userToModify) . $userToModify->getPassword());
        if (!in_array($etag, $request->getHeader('If-Match'))) {
            return Error::createResponse($response, StatusCode::STATUS_PRECONDITION_FAILED); // 412
        }

        if (isset($req_data['username'])) { // Update username
            $usuarioId = $this->findIdBy('username', $req_data['username']);
            if ($usuarioId && intval($args['userId']) !== $usuarioId) {
                // 400 BAD_REQUEST: username already exists
                return Error::createResponse($response, StatusCode::STATUS_BAD_REQUEST);
            }
            assert($req_data['username'] != '');
            $userToModify->setUsername($req_data['username']);
        }

        if (isset($req_data['email'])) { // Update e-mail
            $usuarioId = $this->findIdBy('email', $req_data['email']);
            if ($usuarioId && intval($args['userId']) !== $usuarioId) {
                // 400 BAD_REQUEST: e-mail already exists
                return Error::createResponse($response, StatusCode::STATUS_BAD_REQUEST);
            }
            $userToModify->setEmail($req_data['email']);
        }

        // Update password
        if (isset($req_data['password'])) {
            $userToModify->setPassword($req_data['password']);
        }

        // Update role
        if ($isWriter && isset($req_data['role'])) {
            try {
                $userToModify->setRole($req_data['role']);
            } catch (Throwable) {    // 400 BAD_REQUEST: unexpected role
                return Error::createResponse($response, StatusCode::STATUS_BAD_REQUEST);
            }
        }

        $this->entityManager->flush();

        return $response
            ->withJson($userToModify, 209);
    }

    /**
     * Determines if a user exists with a certain value for an attribute
     *
     * @return int User id (0 if does not exist)
     */
    private function findIdBy(string $attr, string $value): int
    {
        /** @var User|null $user */
        $user = $this->entityManager->getRepository(User::class)->findOneBy([ $attr => $value ]);
        return $user?->getId() ?? 0;
    }
}
