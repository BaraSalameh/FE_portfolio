type StaticSegment = {
    segment: () => string;
    children?: RouteTree;
};

type DynamicSegment<Args extends any[]> = {
    segment: (...args: Args) => string;
    children?: RouteTree;
};

type RouteNode = StaticSegment | DynamicSegment<any[]>;
type RouteTree = Record<string, RouteNode>;

type BoundNode<T extends RouteNode> = {
    path(): string;
} & (T['children'] extends RouteTree
    ? {
        [K in keyof T['children']]:
            T['children'][K] extends { segment: (...a: infer A) => string }
            ? A extends []
                ? BoundNode<T['children'][K]>
                : (...args: A) => BoundNode<T['children'][K]>
            : never;
        }
    : {});


export const routeTree = {
    root: {
        segment: () => '',
        children: {
            search: {
                segment: () => 'search'
            },
            auth: {
                segment: () => 'auth',
                children: {
                    login: { segment: () => 'login' },
                    register: { segment: () => 'register' },
                    refresh: { segment: () => 'refresh' },
                    email: {
                        segment: () => 'email',
                        children: {
                            confirm: { segment: () => 'confirm'}
                        }
                    }
                }
            }
        }
    }
} as const satisfies Record<string, RouteNode>;

function join(parts: string[]) {
  return '/' + parts.filter(Boolean).join('/');
}

function bindNode<T extends RouteNode>(
    node: T,
    parents: string[],
    args: unknown[] = []
): BoundNode<T> {
    const current = [...parents, node.segment(...args)];

    const bound: any = {
        path: () => join(current)
    };

    if (node.children) {
        for (const key in node.children) {
            const child = node.children[key];

            bound[key] = child.segment.length === 0
            ? bindNode(child, current)
            : (...childArgs: unknown[]) => bindNode(child, current, childArgs);
        }
    }

    return bound;
}

function createPaths<T extends RouteTree>(tree: T) {
    const result: any = {};

    for (const key in tree) {
        const node = tree[key];

        result[key] =
        node.segment.length === 0
        ? bindNode(node, [])
        : (...args: unknown[]) => bindNode(node, [], args);
    }

    return result as {
        [K in keyof T]: T[K] extends { segment: (...a: infer A) => string }
        ? A extends []
            ? BoundNode<T[K]>
            : (...args: A) => BoundNode<T[K]>
        : never;
    };
}

export const paths = createPaths(routeTree);