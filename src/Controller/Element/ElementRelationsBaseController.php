<?php

/**
 * src/Controller/Element/ElementRelationsBaseController.php
 *
 * @license https://opensource.org/licenses/MIT MIT License
 * @link    https://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

namespace TDW\ACiencia\Controller\Element;

use Doctrine\ORM;
use Fig\Http\Message\StatusCodeInterface as StatusCode;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Http\Response;
use Slim\Routing\RouteContext;
use TDW\ACiencia\Entity\{ Element, ElementInterface };
use TDW\ACiencia\Utility\Error;

/**
 * Class ElementRelationsBaseController
 */
abstract class ElementRelationsBaseController extends ElementBaseCommandController
{
    /**
     * Summary: get the list of related items of an element
     * e.g.: GET /products/{productId}/entities
     *
     * @param Response $response
     * @param ElementInterface|null $element identified by {elementId}
     * @param string $relatedElementName
     * @param array<Element> $relatedElementArray
     *
     * @return Response
     */
    public function getElements(
        Response $response,
        ElementInterface|null $element,
        string $relatedElementName,
        array $relatedElementArray
    ): Response {
        if (!$element instanceof ElementInterface) {    // 404
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        return $response
            ->withAddedHeader('ETag', md5((string) json_encode($element)))
            ->withAddedHeader('Cache-Control', 'private')
            ->withJson([ $relatedElementName => $relatedElementArray ]);
    }

    /**
     * Add or remove relationships between elements
     * e.g.: PUT /products/{productId}/entities/add/{elementId}
     * e.g.: PUT /products/{productId}/entities/rem/{elementId}
     *
     * @param Request $request
     * @param Response $response
     * @param array<string> $args
     * @param class-string<ElementInterface> $inversedClassName
     *
     * @return Response
     * @throws ORM\Exception\ORMException
     */
    public function operationRelatedElements(
        Request $request,
        Response $response,
        array $args,
        string $inversedClassName
    ): Response {

        if (!$this->checkWriterScope($request)) { // 403
            return Error::createResponse($response, StatusCode::STATUS_FORBIDDEN);
        }

        /** @var Element|null $element */
        $element = $this->entityManager
            ->getRepository(static::getEntityClassName())
            ->find($args[static::getEntityIdName()]);

        if (!$element instanceof ElementInterface) {    // 404
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $relatedElement = $this->entityManager
            ->getRepository($inversedClassName)->find($args['elementId']);
        if (!$relatedElement instanceof ElementInterface) {     // 406
            return Error::createResponse($response, StatusCode::STATUS_NOT_ACCEPTABLE);
        }

        $endPoint = $request->getUri()->getPath();
        $segments = explode('/', $endPoint);

        $operationAdd = sprintf('add%s', self::className($inversedClassName));
        $operationRem = sprintf('remove%s', self::className($inversedClassName));
        ('add' === $segments[array_key_last($segments) - 1])
            ? $element->{$operationAdd}($relatedElement)
            : $element->{$operationRem}($relatedElement);
        $this->entityManager->flush();

        return $response
            ->withStatus(209, 'Content Returned')
            ->withJson($element);
    }

    /**
     * Summary: OPTIONS /<Element>/{elementId}/<Elements>/...
     *          Provides the list of HTTP supported methods
     * e.g.: OPTIONS /products/{productId}/entities/add/{elementId}
     * e.g.: OPTIONS /products/{productId}/entities/rem/{elementId}
     *
     * @param Request $request
     * @param Response $response
     *
     * @return Response
     */
    public function optionsElements(Request $request, Response $response): Response
    {
        $routeContext = RouteContext::fromRequest($request);
        $routingResults = $routeContext->getRoutingResults();
        $methods = $routingResults->getAllowedMethods();

        return $response
            ->withStatus(204)
            ->withAddedHeader('Cache-Control', 'private')
            ->withAddedHeader(
                'Allow',
                implode(',', $methods)
            );
    }

    /**
     * @param string $fqcn  Fully Qualified Class Name
     *
     * @return class-string Class Name
     */
    private static function className(string $fqcn): string
    {
        $elements = explode('\\', $fqcn);
        return $elements[array_key_last($elements)];
    }
}
