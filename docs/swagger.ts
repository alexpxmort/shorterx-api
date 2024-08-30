export const getSwaggerJsDoc = (baseUrl: string) => {
  return {
    openapi: '3.0.0',
    info: {
      title: 'shorterx-api',
      description: 'API for shorterx',
      version: '1.0.0'
    },
    servers: [
      {
        url: `${baseUrl ?? 'http://localhost:5000/'}`,
        description: 'Local server'
      }
    ],
    tags: [
      {
        name: 'auth',
        description: 'Operations related to authentication'
      },
      {
        name: 'url short',
        description: 'Operations related to URL shortening'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ],
    paths: {
      '/auth/create': {
        post: {
          tags: ['auth'],
          summary: 'Create a new user',
          description: 'Register a new user in the system.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      example: 'John Doe'
                    },
                    password: {
                      type: 'string',
                      example: 'password123'
                    },
                    email: {
                      type: 'string',
                      example: 'newuser@example.com'
                    }
                  },
                  required: ['name', 'password', 'email']
                }
              }
            }
          },
          responses: {
            201: {
              description: 'User created successfully'
            },
            400: {
              description: 'Bad request'
            }
          }
        }
      },
      '/auth/signIn': {
        post: {
          tags: ['auth'],
          summary: 'Sign in to the system',
          description:
            'Authenticate a user and return a token and expiration time.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: {
                      type: 'string',
                      example: 'test@mail.com'
                    },
                    password: {
                      type: 'string',
                      example: 'password123'
                    }
                  },
                  required: ['email', 'password']
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Successful sign in',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: {
                        type: 'string',
                        description: 'Authentication token'
                      },
                      expiresIn: {
                        type: 'string',
                        description: 'Token expiration time'
                      }
                    }
                  }
                }
              }
            },
            401: {
              description: 'Invalid credentials'
            },
            400: {
              description: 'Bad request'
            },
            404: {
              description: 'User not found'
            }
          }
        }
      },
      '/shortenUrl/create': {
        post: {
          tags: ['url short'],
          summary: 'Create a new shortened URL',
          description: 'Create a new shortened URL.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    originalUrl: {
                      type: 'string',
                      example: 'https://web.whatsapp.com/'
                    }
                  },
                  required: ['originalUrl']
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Shortened URL created successfully'
            },
            401: {
              description: 'Invalid credentials'
            },
            400: {
              description: 'Bad request'
            }
          }
        }
      },
      '/shortenUrl/list': {
        get: {
          tags: ['url short'],
          summary: 'Retrieve shortened URLs by logged-in user',
          description: 'Retrieve shortened URLs for the logged-in user.',
          responses: {
            200: {
              description: 'Shortened URL retrieved successfully'
            },
            401: {
              description: 'Invalid credentials'
            },
            404: {
              description: 'Not found'
            }
          }
        }
      },
      '/shortenUrl/remove/{shortId}': {
        delete: {
          tags: ['url short'],
          summary: 'Remove a shortened URL',
          description: 'Remove a shortened URL for the logged-in user.',
          parameters: [
            {
              name: 'shortId',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                example: 'abc123'
              }
            }
          ],
          responses: {
            204: {
              description: 'Shortened URL removed successfully'
            },
            401: {
              description: 'Invalid credentials'
            },
            404: {
              description: 'Not found'
            }
          }
        }
      }
    }
  };
};
