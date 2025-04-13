from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import jwt
import datetime
import psycopg2
from psycopg2.extras import RealDictCursor
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY")
CORS(app, supports_credentials=True, origins=[os.environ.get("CORS_ORIGIN")])

# Flask-Bcrypt setup
bcrypt = Bcrypt(app)

# Database connection function
def connect_db():
    try:
        conn = psycopg2.connect(os.environ.get("DATABASE_URL"))
        print("Database connection successful")
        return conn
    except psycopg2.OperationalError as e:
        print(f"Database connection error: {e}")
        return None

# Generate JWT token
def generate_token(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Token expires in 1 hour
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm="HS256")
    print(f"Token generated for user ID: {user_id}")
    return token

# Verify JWT token
def verify_token(token):
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        print(f"Token verified successfully. User ID: {payload['user_id']}")
        return payload["user_id"]
    except jwt.ExpiredSignatureError:
        print("Token has expired")
        return None  # Token has expired
    except jwt.InvalidTokenError:
        print("Invalid token")
        return None  # Invalid token

# Register route
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    name = data.get('name')
    password = data.get('password')

    if not email or not password:
        print("Email and password are required")
        return jsonify({"error": "Email and password are required"}), 400

    conn = connect_db()
    if conn:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            cur.close()
            conn.close()
            print(f"Email already registered: {email}")
            return jsonify({"error": "Email already registered"}), 400

        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        cur.execute("""
            INSERT INTO users (email, name, password_hash)
            VALUES (%s, %s, %s)
            RETURNING id
        """, (email, name, password_hash))
        user_id = cur.fetchone()["id"]
        conn.commit()
        cur.close()
        conn.close()
        print(f"User registered successfully. User ID: {user_id}")
        return jsonify({"message": "User registered successfully"}), 201
    return jsonify({"error": "Database connection failed"}), 500

# Login route
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        print("Email and password are required")
        return jsonify({"error": "Email and password are required"}), 400

    conn = connect_db()
    if conn:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user_data = cur.fetchone()
        cur.close()
        conn.close()

        if not user_data:
            print(f"User not found for email: {email}")
            return jsonify({"error": "Invalid email or password"}), 401

        if not bcrypt.check_password_hash(user_data["password_hash"], password):
            print(f"Invalid password for email: {email}")
            return jsonify({"error": "Invalid email or password"}), 401

        # Generate JWT token
        token = generate_token(user_data["id"])
        print(f"Login successful. Token generated for user ID: {user_data['id']}")
        return jsonify({
            "message": "Logged in successfully",
            "token": token,
            "user": {
                "id": user_data["id"],
                "email": user_data["email"],
                "name": user_data["name"]
            }
        }), 200
    return jsonify({"error": "Database connection failed"}), 500

# Check authentication status
@app.route('/api/me', methods=['GET'])
def get_current_user():
    token = request.headers.get("Authorization")
    print('token is ',token)
    if not token:
        print("Token is missing in /api/me request")
        return jsonify({"error": "Token is missing"}), 401

    user_id = verify_token(token)
    if not user_id:
        print(f"Invalid or expired token: {token}")
        return jsonify({"error": "Invalid or expired token"}), 401


    conn = connect_db()
    if conn:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user_data = cur.fetchone()
        cur.close()
        conn.close()

        if user_data:
            print(f"User data retrieved for user ID: {user_id}")
            return jsonify({
                "user": {
                    "id": user_data["id"],
                    "email": user_data["email"],
                    "name": user_data["name"]
                }
            }), 200
    return jsonify({"error": "Database connection failed"}), 500

# Logout route (optional, as JWT is stateless)
@app.route('/api/logout', methods=['POST'])
def logout():
    # Since JWT is stateless, logout is handled on the client side by deleting the token
    print("User logged out (client-side token deletion)")
    return jsonify({"message": "Logged out successfully"}), 200

# Like a post
@app.route('/api/posts/<int:post_id>/like', methods=['POST'])
def like_post(post_id):
    # Check if the token is provided
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Token is missing"}), 401

    # Verify the token and get the user ID
    user_id = verify_token(token)
    if not user_id:
        return jsonify({"error": "Invalid or expired token"}), 401

    # Connect to the database
    conn = connect_db()
    if not conn:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        # Use RealDictCursor to fetch results as dictionaries
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Check if the user has already liked the post
        cur.execute("""
            SELECT EXISTS (
                SELECT 1 FROM likes
                WHERE post_id = %s AND user_id = %s
            ) AS liked
        """, (post_id, user_id))
        result = cur.fetchone()

        if result["liked"]:
            # User has already liked the post, so unlike it
            cur.execute("""
                DELETE FROM likes
                WHERE post_id = %s AND user_id = %s
            """, (post_id, user_id))
            conn.commit()
            return jsonify({"message": "Post unliked", "liked": False})
        else:
            # User has not liked the post, so like it
            cur.execute("""
                INSERT INTO likes (post_id, user_id, created_at)
                VALUES (%s, %s, %s)
            """, (post_id, user_id, datetime.datetime.now()))
            conn.commit()
            return jsonify({"message": "Post liked", "liked": True})

    except Exception as e:
        # Handle any errors that occur during database operations
        print(f"Error in like_post: {e}")
        return jsonify({"error": "An error occurred while processing your request"}), 500

    finally:
        # Ensure the cursor and connection are closed
        if cur:
            cur.close()
        if conn:
            conn.close()
# Add a comment to a post

@app.route('/api/posts', methods=['GET'])
def get_posts():
    conn = connect_db()
    if conn:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT posts.*, 
                   COUNT(DISTINCT likes.id) as likes_count,
                   COUNT(DISTINCT comments.id) as comments_count
            FROM posts 
            LEFT JOIN likes ON posts.id = likes.post_id
            LEFT JOIN comments ON posts.id = comments.post_id
            GROUP BY posts.id
            ORDER BY posts.created_at DESC
        """)
        posts = cur.fetchall()
        cur.close()
        conn.close()
        print(f"Retrieved {len(posts)} posts from the database")  # Debugging
        return jsonify(posts)
    return jsonify({"error": "Database connection failed"}), 500

@app.route('/api/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    conn = connect_db()
    if conn:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT posts.*, 
                   COUNT(DISTINCT likes.id) as likes_count,
                   COUNT(DISTINCT comments.id) as comments_count,
                   JSON_AGG(
                       JSON_BUILD_OBJECT(
                           'id', comments.id,
                           'content', comments.content,
                           'created_at', comments.created_at,
                           'author', JSON_BUILD_OBJECT('name', users.name)
                       )
                   ) FILTER (WHERE comments.id IS NOT NULL) AS comments
            FROM posts 
            LEFT JOIN likes ON posts.id = likes.post_id
            LEFT JOIN comments ON posts.id = comments.post_id
            LEFT JOIN users ON comments.user_id = users.id
            WHERE posts.id = %s
            GROUP BY posts.id
        """, (post_id,))
        post = cur.fetchone()
        cur.close()
        conn.close()

        if post:
            # Ensure comments is always an array
            if not post['comments']:
                post['comments'] = []
            return jsonify(post)
        else:
            return jsonify({"error": "Post not found"}), 404
    return jsonify({"error": "Database connection failed"}), 500
@app.route('/api/posts/<int:post_id>/comment', methods=['POST'])
def add_comment(post_id):
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Token is missing"}), 401

    user_id = verify_token(token)
    if not user_id:
        return jsonify({"error": "Invalid or expired token"}), 401

    data = request.get_json()
    content = data.get('content')
    if not content:
        return jsonify({"error": "Comment content is required"}), 400

    conn = connect_db()
    if conn:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO comments (post_id, user_id, content, created_at)
            VALUES (%s, %s, %s, %s)
            RETURNING id, created_at
        """, (post_id, user_id, content, datetime.datetime.now()))
        comment_id, created_at = cur.fetchone()
        
        cur.execute("SELECT name FROM users WHERE id = %s", (user_id,))
        user_name = cur.fetchone()[0]
        
        conn.commit()
        cur.close()
        conn.close()
        
        new_comment = {
            "id": comment_id,
            "post_id": post_id,
            "user_id": user_id,
            "content": content,
            "created_at": created_at.isoformat(),
            "author": {
                "name": user_name
            }
        }
        
        return jsonify(new_comment)
    return jsonify({"error": "Database connection failed"}), 500 
@app.route('/api/posts/<int:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    conn = connect_db()
    if conn:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT comments.*, users.name as author_name
            FROM comments
            LEFT JOIN users ON comments.user_id = users.id
            WHERE comments.post_id = %s
            ORDER BY comments.created_at DESC
        """, (post_id,))
        comments = cur.fetchall()
        cur.close()
        conn.close()

        # Format comments to match the expected structure
        formatted_comments = [
            {
                "id": comment["id"],
                "content": comment["content"],
                "created_at": comment["created_at"].isoformat(),
                "author": {
                    "name": comment["author_name"]
                }
            }
            for comment in comments
        ]

        return jsonify(formatted_comments)
    return jsonify({"error": "Database connection failed"}), 500    
@app.route('/api/posts/<int:post_id>/check-like', methods=['GET'])
def check_like(post_id):
    # Get the token from the Authorization header
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Token is missing"}), 401

    # Verify the token and retrieve the user_id
    user_id = verify_token(token)
    if not user_id:
        return jsonify({"error": "Invalid or expired token"}), 401

    # Connect to the database
    conn = connect_db()
    if conn:
        try:
            # Use RealDictCursor to fetch results as dictionaries
            cur = conn.cursor(cursor_factory=RealDictCursor)
            # Check if the user has liked the post
            cur.execute("""
                SELECT EXISTS (
                    SELECT 1 
                    FROM likes
                    WHERE post_id = %s AND user_id = %s
                ) AS liked
            """, (post_id, user_id))
            result = cur.fetchone()
            cur.close()
            conn.close()

            # Return the result as JSON
            return jsonify({"liked": result["liked"]})  # Access 'liked' from result dictionary
        except Exception as e:
            # Handle database query errors
            conn.close()
            return jsonify({"error": "Database query failed", "details": str(e)}), 500
    else:
        # Handle database connection failure
        return jsonify({"error": "Database connection failed"}), 500

# Run the app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)