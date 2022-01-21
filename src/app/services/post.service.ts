import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  url = 'http://localhost:3000/posts';

  constructor(private http: HttpClient) { }


  getPosts(){
    return this.http.get(this.url);
  }

  createPost(post: any){
    return this.http
      .post(this.url, JSON.stringify(post), {
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
  }

  updatePost(post: any){
    return this.http
    .put(this.url + '/' + post?.id, JSON.stringify(post), {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
  }

  deletePost(post:any){
    return this.http.delete(this.url + '/' + post?.id);
  }
}
