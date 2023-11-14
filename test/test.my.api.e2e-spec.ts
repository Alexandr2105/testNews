import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { createApp } from '../src/common/helper/create.app';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('Весь тест', () => {
  const user1 = {
    login: 'Alex',
    password: 'QWERTY',
    email: '5030553@gmail.com',
  };
  const user2 = {
    login: 'Alex1',
    password: 'QWERTY',
    email: '50305531@gmail.com',
  };
  let app: INestApplication;
  let test;
  let token1;
  let token2;
  let news1;
  let news2;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app = createApp(app);
    await app.init();
    test = request(app.getHttpServer());
    return test.del('/testing/all-data').expect(204);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Регистрируем нового пользователя', async () => {
    await test.post('/auth/registration').send(user1).expect(204);
    const info1 = await test
      .post('/auth/registration')
      .send({ login: '', password: '', email: '' })
      .expect(400);
    expect(info1.body).toEqual({
      errorsMessages: [
        { message: 'Не верно заполнено поле', field: 'login' },
        { message: 'email must be an email', field: 'email' },
        { message: 'Не верно заполнено поле', field: 'password' },
      ],
    });
  });

  it('login и получения токена', async () => {
    token1 = await test
      .post('/auth/login')
      .send({
        email: user1.email,
        password: user1.password,
      })
      .expect(200);
    expect(token1.body).toEqual({
      accessToken: expect.any(String),
    });
    await test
      .post('/auth/login')
      .send({
        email: 'user.login',
        password: 'user.password',
      })
      .expect(401);
    const info = await test
      .get('/auth/me')
      .auth(token1.body.accessToken, { type: 'bearer' })
      .expect(200);
    expect(info.body).toEqual({
      email: user1.email,
      login: user1.login,
      userId: expect.any(Number),
      createdAt: expect.any(String),
    });
    await test
      .get('/auth/me')
      .auth('token.body.accessToken', { type: 'bearer' })
      .expect(401);
  });

  it('Получаем новую пару accessToken и refreshToken', async () => {
    const response = await test
      .post('/auth/login')
      .send({ email: user1.email, password: user1.password })
      .expect(200);
    const refreshToken = response.headers['set-cookie'];
    await test
      .post('/auth/refresh-token')
      .set('Cookie', refreshToken)
      .expect(200);
  });

  it('Создание новостей', async () => {
    const newNews = await test
      .post('/news')
      .auth(token1.body.accessToken, { type: 'bearer' })
      .send({
        news: 'dfasdfasdfa adfdasfsdafa adsf',
      })
      .expect(201);
    expect(newNews.body).toEqual({
      news: 'dfasdfasdfa adfdasfsdafa adsf',
      createdAt: expect.any(String),
      authorId: expect.any(Number),
      updateAt: null,
      newsId: expect.any(Number),
    });
    await test
      .post('/news')
      .auth(token1.body.accessToken, { type: 'bearer' })
      .send({
        news: 'dfasdfasdfa adfdasfsdafa adsf',
      })
      .expect(201);

    await test
      .post('/news')
      .send({
        news: 'dfasdfasdfa adfdasfsdafa adsf',
      })
      .expect(401);

    await test
      .post('/news')
      .send({
        news: 'dfasdfasdfa adfdasfsdafa adsf',
      })
      .expect(401);

    const result = await test
      .post('/news')
      .auth(token1.body.accessToken, { type: 'bearer' })
      .send({
        news: '',
      })
      .expect(400);
    expect(result.body).toEqual({
      errorsMessages: [
        {
          field: 'news',
          message: 'news should not be empty',
        },
      ],
    });
  });

  it('Получение новостей', async () => {
    const newNews = await test.get('/news').expect(200);
    expect(newNews.body).toEqual([
      {
        news: 'dfasdfasdfa adfdasfsdafa adsf',
        createdAt: expect.any(String),
        authorId: expect.any(Number),
        updateAt: null,
        newsId: expect.any(Number),
      },
      {
        news: 'dfasdfasdfa adfdasfsdafa adsf',
        createdAt: expect.any(String),
        authorId: expect.any(Number),
        updateAt: null,
        newsId: expect.any(Number),
      },
    ]);

    news1 = await test.get(`/news/${newNews.body[1].newsId}`).expect(200);
    news2 = await test.get(`/news/${newNews.body[0].newsId}`).expect(200);
    expect(news1.body).toEqual({
      news: 'dfasdfasdfa adfdasfsdafa adsf',
      createdAt: expect.any(String),
      authorId: expect.any(Number),
      updateAt: null,
      newsId: newNews.body[1].newsId,
    });
    await test.get(`/news/234456`).expect(404);
  });

  it('Обновление новостей', async () => {
    const newNews = await test
      .put(`/news/${news1.body.newsId}`)
      .auth(token1.body.accessToken, { type: 'bearer' })
      .send({
        news: 'dfasdfasdfa',
      })
      .expect(201);
    expect(newNews.body).toEqual({
      news: 'dfasdfasdfa',
      createdAt: expect.any(String),
      authorId: expect.any(Number),
      updateAt: expect.any(String),
      newsId: news1.body.newsId,
    });

    await test
      .put(`/news/${news1.newsId}`)
      .send({
        news: 'dfasdfasdfa',
      })
      .expect(401);

    await test
      .put(`/news/34324`)
      .auth(token1.body.accessToken, { type: 'bearer' })
      .send({
        news: 'dfasdfasdfa',
      })
      .expect(404);
  });

  it('Удаление новостей', async () => {
    await test.delete(`/news/${news1.body.newsId}`).expect(401);
    await test
      .delete(`/news/${news1.body.newsId}`)
      .auth(token1.body.accessToken, { type: 'bearer' })
      .expect(200);
    await test.get(`/news/${news1.body.newsId}`).expect(404);
  });

  it('Проверка на 403 ошибку', async () => {
    await test.post('/auth/registration').send(user2).expect(204);
    token2 = await test
      .post('/auth/login')
      .send({
        email: user2.email,
        password: user2.password,
      })
      .expect(200);

    await test
      .put(`/news/${news2.body.newsId}`)
      .auth(token2.body.accessToken, { type: 'bearer' })
      .send({
        news: 'dfasdfasdfa',
      })
      .expect(403);

    await test
      .delete(`/news/${news2.body.newsId}`)
      .auth(token2.body.accessToken, { type: 'bearer' })
      .expect(403);
  });
});
